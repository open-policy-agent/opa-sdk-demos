import { Injectable } from '@nestjs/common';
import { Opa, authorizer } from 'opa/sdk';

@Injectable()
export class AuthzService {
  private readonly opa = new Opa(); // NB(sr): we'd need to get some config into this
  private readonly authorizer = authorizer<Record<string, any>, boolean>(
    this.opa,
    'cats/allow',
  );

  async authorize(inp: any) {
    return await this.authorizer(inp);
  }
}
