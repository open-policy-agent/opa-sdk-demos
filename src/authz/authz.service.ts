import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Opa } from 'opa/sdk';
import { authorizer } from 'opa/sdk/helpers';

@Injectable()
export class AuthzService {
  private opa: Opa;

  constructor(private configService: ConfigService) {
    this.opa = new Opa({ serverURL: this.configService.getOrThrow('OPA_URL') });
  }

  async authorize(inp: Record<string, any>, path: string): Promise<boolean> {
    return await authorizer<Record<string, any>, boolean>(this.opa, path)(inp);
  }
}
