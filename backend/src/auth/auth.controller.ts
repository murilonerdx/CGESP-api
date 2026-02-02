import { Controller, Post, Body, Get, UseGuards, Req, Patch, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService
    ) { }

    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/login')
    signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }

    @Get('/me')
    @UseGuards(AuthGuard())
    getMe(@Req() req) {
        return this.authService.getMe(req.user.id);
    }

    @Patch('/location')
    @UseGuards(AuthGuard())
    updateLocation(@Req() req, @Body('region') region: string) {
        return this.authService.updateRegion(req.user.id, region);
    }

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) { }

    @Get('/google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        const { accessToken } = await this.authService.googleLogin(req.user);
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3001');
        return res.redirect(`${frontendUrl}?token=${accessToken}`);
    }

    @Get('/places')
    @UseGuards(AuthGuard())
    getPlaces(@Req() req) {
        return this.authService.getFavoritePlaces(req.user.id);
    }

    @Post('/places')
    @UseGuards(AuthGuard())
    addPlace(@Req() req, @Body() data: any) {
        return this.authService.addFavoritePlace(req.user.id, data);
    }

    @Patch('/places/:id')
    @UseGuards(AuthGuard())
    updatePlace(@Req() req, @Body() data: any) {
        return this.authService.updateFavoritePlace(req.user.id, parseInt(req.params.id), data);
    }

    @Patch('/places/remove') // Simplified for now since we don't have DELETE in frontend easily with JSON sometimes
    @UseGuards(AuthGuard())
    removePlace(@Req() req, @Body('id') id: number) {
        return this.authService.removeFavoritePlace(req.user.id, id);
    }
}
