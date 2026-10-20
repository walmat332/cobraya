import { randomUUID } from 'crypto';
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Company } from '../entities/company.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // 1. Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({ where: { email: registerDto.email } });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // 2. Crear la Empresa (Tenant)
    const company = this.companyRepository.create({
      id: randomUUID(),
      ruc: registerDto.companyRuc,
      razonSocial: registerDto.companyName,
      sunatEnvironment: 'DEMO', // Por defecto en modo demo para el MVP
    });
    const savedCompany = await this.companyRepository.save(company);

    // 3. Crear el Usuario asociado a la Empresa
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      id: randomUUID(),
      email: registerDto.email,
      password: hashedPassword,
      role: 'ADMIN',
      companyId: savedCompany.id,
    });
    const savedUser = await this.userRepository.save(user);

    // 4. Generar Token JWT
    const payload = { sub: savedUser.id, email: savedUser.email, companyId: savedCompany.id, role: savedUser.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: savedUser.id, email: savedUser.email, role: savedUser.role, companyId: savedCompany.id },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, companyId: user.companyId, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role, companyId: user.companyId },
    };
  }
}


