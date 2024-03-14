import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Opa } from 'opa/sdk';
import { authorizer } from 'opa/sdk/helpers';

@Injectable()
export class AuthzService {
  private opa: Opa;
  private authorizer: (_?: Record<string, any>) => Promise<boolean>;

  constructor(private configService: ConfigService) {
    this.opa = new Opa({ serverURL: this.configService.getOrThrow('OPA_URL') });
    this.authorizer = authorizer<Record<string, any>, boolean>(
      this.opa,
      this.configService.getOrThrow('OPA_PATH'),
    );
  }

  async authorize(inp: any): Promise<boolean> {
    return await this.authorizer(inp);
  }
}
