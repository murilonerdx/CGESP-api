import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { DailyAnalytic } from './daily-analytic.entity';

@Injectable()
export class ScraperService {
    private readonly baseUrl = 'https://www.cgesp.org/v3/index.jsp';

    constructor(
        @InjectRepository(DailyAnalytic)
        private dailyAnalyticRepository: Repository<DailyAnalytic>,
    ) { }

    async getScrapedData() {
        try {
            const response = await axios.get(this.baseUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const html = response.data;
            const data = await this.parseHtml(html);

            // Save snapshots for analytics (Simplified: we save the total active for the day)
            await this.saveSnapshot(data);

            return data;
        } catch (error) {
            throw error;
        }
    }

    private async saveSnapshot(data: any) {
        const today = new Date().toISOString().split('T')[0];
        const regions = ['Geral']; // In a more complex setup, we'd scrape per region

        for (const regionName of regions) {
            const existing = await this.dailyAnalyticRepository.findOne({
                where: { date: today, region: regionName }
            });

            const total = this.parsePointString(data.floodPoints.totalToday || '0 pts');
            const intransitable = this.parsePointString(data.floodPoints.intransitable || '0 pts');

            if (existing) {
                // Update with higher values if found (since multiple scrapes happen)
                existing.totalPoints = Math.max(existing.totalPoints, total);
                existing.intransitablePoints = Math.max(existing.intransitablePoints, intransitable);
                await this.dailyAnalyticRepository.save(existing);
            } else {
                const snapshot = this.dailyAnalyticRepository.create({
                    date: today,
                    region: regionName,
                    totalPoints: total,
                    intransitablePoints: intransitable
                });
                await this.dailyAnalyticRepository.save(snapshot);
            }
        }
    }

    private parsePointString(str: string): number {
        return parseInt(str.split(' ')[0]) || 0;
    }

    async getAnalytics(): Promise<DailyAnalytic[]> {
        return this.dailyAnalyticRepository.find({
            order: { date: 'ASC' }
        });
    }

    async parseHtml(html: string) {
        const $ = cheerio.load(html);

        // Weather Forecast
        const forecastDate = $('.dt-previsao .txt-data-prev').text().trim().split('\n')[0].trim();
        const forecastYear = $('.dt-previsao .ano').text().trim();
        const minTemp = $('.temp-min').text().trim();
        const maxTemp = $('.temp-max').text().trim();
        const minUmid = $('.umid-min').text().trim();
        const maxUmid = $('.umid-max').text().trim();

        const periods: any[] = [];
        $('.prev-periodos .prev-cond-tempo').each((i, el) => {
            const periodName = $(el).find('.cond-tempo h1').text().trim();
            const condition = $(el).find('.cond-tempo h2').first().text().trim();
            const potentialText = $(el).find('.cond-tempo h2').last().text().trim();
            const imageSrc = $(el).find('.fig-tempo img').attr('src');
            const title = $(el).find('.fig-tempo img').attr('title');

            periods.push({
                period: periodName,
                condition,
                potential: potentialText.replace('PT:', '').trim(),
                image: `https://www.cgesp.org/v3/${imageSrc}`,
                title
            });
        });

        // Flood Points (Alagamentos)
        const activeFloodPoints = parseInt($('.num-ativos').text().trim()) || 0;
        const transitable = $('.col2-resumo h1').first().text().replace('Transitáveis =', '').trim();
        const intransitable = $('.col2-resumo h1').eq(1).text().replace('Intransitáveis =', '').trim();
        const totalToday = $('.alag-total h1').text().replace('Total:', '').trim();

        // News (Notícias)
        const news: any[] = [];
        $('.col-noticias .noticia').each((i, el) => {
            const title = $(el).find('h1').text().trim();
            const dateTime = $(el).find('h2').text().trim();
            const link = $(el).find('a').attr('href');

            news.push({
                title,
                dateTime,
                link: `https://www.cgesp.org/v3/${link}`
            });
        });

        const today = new Date().toLocaleDateString('pt-BR');
        const activeDetails = await this.getFloodDetails(today);

        return {
            forecast: {
                date: forecastDate,
                year: forecastYear,
                minTemp,
                maxTemp,
                minHumidity: minUmid,
                maxHumidity: maxUmid,
                periods
            },
            floodPoints: {
                active: activeFloodPoints,
                transitable,
                intransitable,
                totalToday,
                details: activeDetails.zones // Include detailed zones and points
            },
            news
        };
    }

    async getFloodDetails(date: string) {
        try {
            const response = await axios.get(`https://www.cgesp.org/v3/alagamentos.jsp?dataBusca=${date}&enviaBusca=Buscar`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const html = response.data;
            return this.parseFloodHtml(html);
        } catch (error) {
            // Error fetching flood details silently failing
            throw error;
        }
    }

    private parseFloodHtml(html: string) {
        const $ = cheerio.load(html);
        const zones: any[] = [];
        let currentZone: any = null;
        let currentNeighborhood: any = null;

        $('.content').children().each((i, el) => {
            const $el = $(el);

            if ($el.hasClass('tit-bairros')) {
                currentZone = { name: $el.text().trim(), neighborhoods: [] };
                zones.push(currentZone);
            } else if ($el.hasClass('tb-pontos-de-alagamentos')) {
                $el.find('tr').each((j, tr) => {
                    const $tr = $(tr);
                    const $bairro = $tr.find('.bairro');

                    if ($bairro.length) {
                        currentNeighborhood = {
                            name: $bairro.text().trim(),
                            totalPoints: $tr.find('.total-pts').text().trim(),
                            points: []
                        };
                        if (currentZone) {
                            currentZone.neighborhoods.push(currentNeighborhood);
                        }
                    } else {
                        const $ponto = $tr.find('.ponto-de-alagamento');
                        if ($ponto.length) {
                            const statusLi = $ponto.find('ul li').first();
                            const status = statusLi.attr('title');
                            const statusClass = statusLi.attr('class');

                            let timeRange = '';
                            let street = '';
                            let direction = '';
                            let reference = '';

                            // Robust extraction via text markers
                            $ponto.find('li').each((k, li) => {
                                const $li = $(li);
                                let text = $li.text().trim();

                                // Inject spaces to separate jammed fields (e.g., "15:38AV", "AMBOSReferência")
                                text = text.replace(/Sentido:/g, ' Sentido: ')
                                    .replace(/Referência:/g, ' Referência: ');

                                // Extract Time Range
                                const timeMatch = text.match(/((?:De\s+)?\d{2}:\d{2}\s+a\s+\d{2}:\d{2})/);
                                if (timeMatch) {
                                    timeRange = timeMatch[1].trim();
                                    // If text contains more than just time, it's likely the street appended
                                    const residue = text.replace(timeMatch[0], '').trim();
                                    if (residue.length > 2 && !residue.includes('Sentido') && !residue.includes('Referência')) {
                                        street = residue;
                                    }
                                }
                                // Capture Street if it's in col-local and NOT a time range
                                else if ($li.closest('.col-local').length > 0 && !street.includes(text)) {
                                    street = text;
                                }

                                // Extract Direction & Reference
                                if (text.includes('Referência:')) {
                                    const parts = text.split('Referência:');
                                    const refPart = parts[1].trim();
                                    const potentialDir = parts[0].replace('Sentido:', '').trim();

                                    if (refPart) reference = refPart;
                                    if (potentialDir) direction = potentialDir;
                                } else if (text.includes('Sentido:')) {
                                    direction = text.replace('Sentido:', '').trim();
                                }
                            });

                            if (currentNeighborhood) {
                                currentNeighborhood.points.push({
                                    status,
                                    statusClass,
                                    timeRange,
                                    street,
                                    direction,
                                    reference
                                });
                            }
                        }
                    }
                });
            }
        });

        const activeTransitables = $('.col2-resumo h1').first().text().split('=')[1]?.trim() || '0 pts';
        const activeIntransitables = $('.col2-resumo h1').eq(1).text().split('=')[1]?.trim() || '0 pts';
        const inactiveTransitables = $('.alag-resumo').eq(1).find('.col2-resumo h1').first().text().split('=')[1]?.trim() || '0 pts';
        const inactiveIntransitables = $('.alag-resumo').eq(1).find('.col2-resumo h1').last().text().split('=')[1]?.trim() || '0 pts';

        return {
            zones,
            summary: {
                active: { transitable: activeTransitables, intransitable: activeIntransitables },
                inactive: { transitable: inactiveTransitables, intransitable: inactiveIntransitables }
            }
        };
    }
}
