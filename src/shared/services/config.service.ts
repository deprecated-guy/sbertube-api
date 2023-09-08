import { Injectable } from '@nestjs/common';
import { AppModule } from '../../app.module';

@Injectable()
export class ConfigService {
  public secret = process.env.SECRET_KEY;
  public expires_in = process.env.EXPIRES_IN;
}
