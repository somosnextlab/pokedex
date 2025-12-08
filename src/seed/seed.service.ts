import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

const url = 'https://pokeapi.co/api/v2/pokemon?limit=10'

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  //Insetar por lote

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(url);

    data.results.forEach(({name, url}) => {
      const segments = url.split('/')
      const no = +segments[ segments.length - 2]
      console.log({name, no})
    })

    return data.results;
  }

}
