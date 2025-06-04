BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[participantes] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nome] VARCHAR(255) NOT NULL,
    [cpf] VARCHAR(11) NOT NULL,
    [ra] VARCHAR(6),
    [rf] VARCHAR(4),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [participantes_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [participantes_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [participantes_cpf_key] UNIQUE NONCLUSTERED ([cpf])
);

-- CreateTable
CREATE TABLE [dbo].[ingressos] (
    [id] INT NOT NULL IDENTITY(1,1),
    [participante_id] INT NOT NULL,
    [quantidade] INT NOT NULL,
    [data_compra] DATETIME2 NOT NULL,
    [funcionario_checkin] VARCHAR(100),
    [checkin_realizado] BIT NOT NULL CONSTRAINT [ingressos_checkin_realizado_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [ingressos_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [ingressos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IDX_PARTICIPANTES_CPF] ON [dbo].[participantes]([cpf]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IDX_INGRESSOS_PARTICIPANTE_ID] ON [dbo].[ingressos]([participante_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IDX_INGRESSOS_DATA_COMPRA] ON [dbo].[ingressos]([data_compra]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IDX_INGRESSOS_CHECKIN] ON [dbo].[ingressos]([checkin_realizado]);

-- AddForeignKey
ALTER TABLE [dbo].[ingressos] ADD CONSTRAINT [ingressos_participante_id_fkey] FOREIGN KEY ([participante_id]) REFERENCES [dbo].[participantes]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
