import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';

export const MongoConfig = MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
        retryAttempts: 10,
        retryDelay: 3000,
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
    }),
});