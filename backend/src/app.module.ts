import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperModule } from './scraper/scraper.module';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { DailyAnalytic } from './scraper/daily-analytic.entity';
import { FavoritePlace } from './auth/favorite-place.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'sqlite' | 'postgres'>('DB_TYPE', 'sqlite'),
        database: configService.get<string>('DB_NAME', 'db.sqlite3'),
        entities: [User, DailyAnalytic, FavoritePlace],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
    ScraperModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
