// import { Module } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// import { entities } from './entities';

// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({
//       useFactory: (cfg: ConfigService) => ({
//         type: 'postgres',
//         host: cfg.get<string>('DB_HOST'),
//         port: Number(cfg.get<number>('DB_PORT')),
//         username: cfg.get<string>('DB_USER'),
//         password: cfg.get<string>('DB_PW'),
//         database: cfg.get<string>('DB_NAME'),
//         entities: entities, // or use __dirname + '/../**/*.entity.{ts,js}'
//         namingStrategy: new SnakeNamingStrategy(),
//         logging: ['error'],
//         synchronize: true, // disable in production
//       }),
//       inject: [ConfigService],
//     }),
//   ],
// })
// export class DatabaseModule {}
