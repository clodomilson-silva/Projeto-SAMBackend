import { IsEnum } from 'class-validator';

export enum RequestStatus {
  PENDENTE = 'PENDENTE',
  EM_ANALISE = 'EM_ANALISE',
  EM_ATENDIMENTO = 'EM_ATENDIMENTO',
  CONCLUIDA = 'CONCLUIDA',
  INDEFERIDA = 'INDEFERIDA',
  CANCELADA = 'CANCELADA',
}

export class UpdateRequestStatusDto {
  @IsEnum(RequestStatus)
  status!: RequestStatus;
}
