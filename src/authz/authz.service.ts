import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OPAClient, Result } from '@styra/opa';

@Injectable()
export class AuthzService {
  private opa: OPAClient;

  constructor(private configService: ConfigService) {
    this.opa = new OPAClient(this.configService.getOrThrow('OPA_URL'));
  }

  async authorize(
    inp: Record<string, any>,
    path: string,
    fromResult?: (_?: Result) => boolean,
  ): Promise<boolean> {
    return await this.opa.evaluate(path, inp, { fromResult });
  }
}
