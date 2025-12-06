import { IsString, MinLength, IsPositive, IsInt, Min } from 'class-validator';

export class CreatePokemonDto {

    // isInt, isPositive, min 1
    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    // isString, MinLenght 1
    @IsString()
    @MinLength(1)
    name: string;
}
