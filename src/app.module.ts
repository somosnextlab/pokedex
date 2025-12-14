import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/app.config';


@Module({
  imports: [
    //Siempre declararlo al inicio
    ConfigModule.forRoot({
      load: [ EnvConfiguration ]
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
    // error indica que la variable puede ser undefined (en caso de que no configures las variables de entorno).
    // Una solución es indicarle que siempre vas a tener la variable definida, de esta manera:
    MongooseModule.forRoot(process.env.MONGODB!),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {}