import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adaters/axios.adapter';

@Module({
    providers: [AxiosAdapter],
    exports: [AxiosAdapter]
})
export class CommonModule {}
