"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ingresso = exports.Participante = void 0;
require("reflect-metadata");
const class_validator_1 = require("class-validator");
class Participante {
    id;
    nome;
    cpf;
    ra;
    rf;
    ingressos;
    createdAt;
    updatedAt;
}
exports.Participante = Participante;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Nome é obrigatório' }),
    (0, class_validator_1.IsString)({ message: 'Nome deve ser uma string' }),
    __metadata("design:type", String)
], Participante.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'CPF é obrigatório' }),
    (0, class_validator_1.IsString)({ message: 'CPF deve ser uma string' }),
    (0, class_validator_1.Length)(11, 11, { message: 'CPF deve ter exatamente 11 dígitos' }),
    __metadata("design:type", String)
], Participante.prototype, "cpf", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'RA deve ser uma string' }),
    (0, class_validator_1.Length)(6, 6, { message: 'RA deve ter exatamente 6 dígitos' }),
    __metadata("design:type", String)
], Participante.prototype, "ra", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'RF deve ser uma string' }),
    (0, class_validator_1.Length)(4, 4, { message: 'RF deve ter exatamente 4 dígitos' }),
    __metadata("design:type", String)
], Participante.prototype, "rf", void 0);
class Ingresso {
    id;
    participanteId;
    participante;
    quantidade;
    dataCompra;
    funcionarioCheckin;
    checkinRealizado;
    createdAt;
    updatedAt;
}
exports.Ingresso = Ingresso;
//# sourceMappingURL=types.js.map