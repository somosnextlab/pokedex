import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adaters/axios.adapter';

const url = 'https://pokeapi.co/api/v2/pokemon?limit=650'

@Injectable()
export class SeedService {
  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,

  ) { }

  //Insetar por loteS

  async executeSeed() {
    await this.pokemonModel.deleteMany({})
    const data = await this.http.get<PokeResponse>(url);

    /*data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/')
      const no = +segments[segments.length - 2]

      // asi insertamos la data
      await this.pokemonModel.create({ name, no })
    }) */

    // 1 - Una forma eficiente de insertar, en caso de muchos registros
    // Si ves parameter of type 'never' en un .push(...) o en una función similar, casi seguro:
    // Declaraste un array vacío sin tipo, tipo const arr = [];
    // O un genérico quedó en never por falta de anotación.
    /* const insertPromisesArray: Promise<Pokemon>[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no = +segments[segments.length - 2];

      insertPromisesArray.push(
        this.pokemonModel.create({name, no})
      )
    })

    await Promise.all( insertPromisesArray) */

    //2. Forma mas eficiente de hacer insescion de multiple registros

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no = +segments[segments.length - 2];
      const na = name

      pokemonToInsert.push({ name, no })
    })

    await this.pokemonModel.insertMany(pokemonToInsert)


    return 'Seed executed';
  }

}
