import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService
  ) { 
    this.defaultLimit = configService.get<number>('defaultLimit')
  }


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  findAll( paginationDto: PaginationDto) {

    // Error: 'process.env.PORT' is possibly 'undefined'.ts(18048) al setear el limit: limit = +process.env.PORT
    // Para quitarlo, en el tsconfig.json tiene el strictNullChecks ponerlo en false
    const { limit = this.defaultLimit, offset = 0 } = paginationDto


    return this.pokemonModel.find()
    .limit( limit )
    .skip( offset )
    .sort({
      no: 1
    })
    .select('-__v')
  }

  async findOne(term: string) {
    //en caso de no encontrar ningún Pokémon hay q devolver null.
    let pokemon: Pokemon | null = null;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    }

    // Verificacion por MongoID

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term)
    }

    // Verificacion por name

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`)

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto)
      return {
        ...pokemon.toJSON(), ...updatePokemonDto
      }
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    //const pokemon = await this.findOne( id )
    //await pokemon.deleteOne();
    //const result = this.pokemonModel.findByIdAndDelete(id)
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id})

    if(deletedCount === 0) {
      throw new BadRequestException(`Pokemon with ${id} not found`)
    }
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error)
    throw new InternalServerErrorException(`Can't update Pokemon - Check server logs`)
  }
}
