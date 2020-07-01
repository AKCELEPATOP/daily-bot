import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {instance} from './express';
import {ExpressAdapter} from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(instance),
        {cors: true});
    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT || 8041);
}

bootstrap();
