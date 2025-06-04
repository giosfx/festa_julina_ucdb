/*
  Warnings:

  - You are about to drop the `ingressos` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ingressos] DROP CONSTRAINT [ingressos_participante_id_fkey];

-- DropTable
DROP TABLE [dbo].[ingressos];

-- CreateTable
CREATE TABLE [dbo].[checkins] (
    [id] INT NOT NULL IDENTITY(1,1),
    [participante_id] INT NOT NULL,
    [data_checkin] DATETIME2 NOT NULL,
    [funcionario_checkin] VARCHAR(100),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [checkins_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [checkins_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IDX_CHECKINS_PARTICIPANTE_ID] ON [dbo].[checkins]([participante_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IDX_CHECKINS_DATA_CHECKIN] ON [dbo].[checkins]([data_checkin]);

-- AddForeignKey
ALTER TABLE [dbo].[checkins] ADD CONSTRAINT [checkins_participante_id_fkey] FOREIGN KEY ([participante_id]) REFERENCES [dbo].[participantes]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
