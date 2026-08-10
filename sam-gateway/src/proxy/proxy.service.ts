import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';

type HttpMethod = 'get' | 'post' | 'patch' | 'delete';

@Injectable()
export class ProxyService {
  private readonly authUrl: string;
  private readonly userUrl: string;
  private readonly requestUrl: string;
  private readonly appointmentUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.authUrl = this.configService.get<string>(
      'AUTH_SERVICE_URL',
      'http://localhost:3001',
    );
    this.userUrl = this.configService.get<string>(
      'USER_SERVICE_URL',
      'http://localhost:3002',
    );
    this.requestUrl = this.configService.get<string>(
      'REQUEST_SERVICE_URL',
      'http://localhost:3003',
    );
    this.appointmentUrl = this.configService.get<string>(
      'APPOINTMENT_SERVICE_URL',
      'http://localhost:3004',
    );
  }

  auth<T>(method: HttpMethod, path: string, data?: unknown, token?: string) {
    return this.forward<T>(this.authUrl, method, path, data, token);
  }

  users<T>(method: HttpMethod, path: string, data?: unknown, token?: string) {
    return this.forward<T>(this.userUrl, method, path, data, token);
  }

  requests<T>(method: HttpMethod, path: string, data?: unknown, token?: string) {
    return this.forward<T>(this.requestUrl, method, path, data, token);
  }

  appointments<T>(
    method: HttpMethod,
    path: string,
    data?: unknown,
    token?: string,
  ) {
    return this.forward<T>(this.appointmentUrl, method, path, data, token);
  }

  private async forward<T>(
    baseUrl: string,
    method: HttpMethod,
    path: string,
    data?: unknown,
    token?: string,
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      method,
      url: `${baseUrl}${path}`,
      data,
      headers: token ? { Authorization: token } : undefined,
    };

    try {
      const response = await axios.request<T>(config);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        throw new HttpException(
          error.response.data,
          error.response.status,
        );
      }
      throw new HttpException(
        'Erro ao comunicar com o serviço interno',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
