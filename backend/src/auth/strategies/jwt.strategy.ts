import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    console.log('🔑 [JWT STRATEGY] Iniciando con secreto:', secret ? 'OK (longitud ' + secret.length + ')' : 'FALTANTE');
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    console.log('🔍 [JWT STRATEGY] Payload recibido del token:', payload);
    
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    
    if (!user) {
      console.log('❌ [JWT STRATEGY] Usuario NO encontrado en BD con ID:', payload.sub);
      throw new UnauthorizedException('Token inválido o usuario no encontrado');
    }
    
    console.log('✅ [JWT STRATEGY] Usuario validado exitosamente:', user.email);
    
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };
  }
}
