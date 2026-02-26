-- DropForeignKey
ALTER TABLE "Movimiento" DROP CONSTRAINT "Movimiento_clienteId_fkey";

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
