import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OPA } from 'opa/highlevel';

@Injectable()
export class AuthzService {
  private opa: OPA;

  constructor(private configService: ConfigService) {
    this.opa = new OPA(this.configService.getOrThrow('OPA_URL'));
  }

  async authorize(inp: Record<string, any>, path: string): Promise<boolean> {
    return await this.opa.authorize<Record<string, any>, boolean>(path, inp);
  }
}
