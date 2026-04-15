import { IsEnum } from 'class-validator';

export enum DossierStatus {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  ARQUIVADO = 'ARQUIVADO',
}

export class UpdateDossierStatusDto {
  @IsEnum(DossierStatus)
  status!: DossierStatus;
}
