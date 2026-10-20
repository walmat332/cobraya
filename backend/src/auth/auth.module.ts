import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../entities/user.entity';
import { Company } from '../entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'cobra-ya-super-secret-key-2026',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService], // Para que otros módulos puedan usarlo si es necesario
})
export class AuthModule {}

