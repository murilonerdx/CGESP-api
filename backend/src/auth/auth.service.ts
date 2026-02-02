import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { FavoritePlace } from './favorite-place.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(FavoritePlace)
        private favoritePlaceRepository: Repository<FavoritePlace>,
        private jwtService: JwtService,
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const { email, password, region } = authCredentialsDto;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ email, password: hashedPassword, region });

        try {
            const savedUser = await this.userRepository.save(user);
            return savedUser;
        } catch (error) {

            if (error.message && error.message.includes('UNIQUE constraint failed')) {
                throw new ConflictException('Email already exists');
            }
            throw error;
        }
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { email, password } = authCredentialsDto;
        const user = await this.userRepository.findOne({ where: { email } });

        if (user && user.password && (await bcrypt.compare(password, user.password))) {
            const payload = { email, sub: user.id };
            const accessToken = this.jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
    }

    async getMe(userId: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id: userId } });
    }

    async updateRegion(userId: number, region: string): Promise<User | null> {
        await this.userRepository.update(userId, { region });
        return this.getMe(userId);
    }

    async googleLogin(googleUser: any): Promise<{ accessToken: string }> {
        let user = await this.userRepository.findOne({ where: { googleId: googleUser.googleId } });

        if (!user) {
            // Try matching by email
            user = await this.userRepository.findOne({ where: { email: googleUser.email } });
            if (user) {
                user.googleId = googleUser.googleId;
                user.avatarUrl = googleUser.picture;
                await this.userRepository.save(user);
            } else {
                user = this.userRepository.create({
                    email: googleUser.email,
                    googleId: googleUser.googleId,
                    avatarUrl: googleUser.picture
                });
                await this.userRepository.save(user);
            }
        }

        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }

    async getFavoritePlaces(userId: number): Promise<FavoritePlace[]> {
        return this.favoritePlaceRepository.find({ where: { userId } });
    }

    async addFavoritePlace(userId: number, data: any): Promise<FavoritePlace> {
        const place = this.favoritePlaceRepository.create({ ...data, userId });
        const savedPlace = await this.favoritePlaceRepository.save(place);
        return savedPlace as unknown as FavoritePlace;
    }

    async updateFavoritePlace(userId: number, placeId: number, data: any): Promise<FavoritePlace | null> {
        await this.favoritePlaceRepository.update({ id: placeId, userId }, data);
        return this.favoritePlaceRepository.findOne({ where: { id: placeId, userId } });
    }

    async removeFavoritePlace(userId: number, placeId: number): Promise<void> {
        await this.favoritePlaceRepository.delete({ id: placeId, userId });
    }
}
