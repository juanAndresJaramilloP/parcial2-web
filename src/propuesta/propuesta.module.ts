import { Module } from '@nestjs/common';
import { PropuestaService } from './propuesta.service';

@Module({
  providers: [PropuestaService]
})
export class PropuestaModule {}
