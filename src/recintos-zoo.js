class RecintosZoo {
    // Dados estáticos dos recintos e animais
    static recintos = [
        { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [3, 'macaco'] },
        { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
        { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [1, 'gazela'] },
        { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
        { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [1, 'leao'] }
    ];

    static animais = [
        { especie: 'LEAO', tamanho: 3, bioma: 'savana', carnivoro: true },
        { especie: 'LEOPARDO', tamanho: 2, bioma: 'savana', carnivoro: true },
        { especie: 'CROCODILO', tamanho: 3, bioma: 'rio', carnivoro: true },
        { especie: 'MACACO', tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
        { especie: 'GAZELA', tamanho: 2, bioma: 'savana', carnivoro: false },
        { especie: 'HIPOPOTAMO', tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
    ];

    // Função principal para analisar recintos
    analisaRecintos(animal, quantidade) {
        const especieFiltrada = this.filtrarEspecie(animal);
        if (!especieFiltrada) {
            return { erro: "Animal inválido", recintosViaveis: false };
        }
    
        if (!this.validarQuantidade(quantidade)) {
            return { erro: "Quantidade inválida", recintosViaveis: false };
        }
    
        const recintosFiltrados = this.filtrarRecintosPorBioma(especieFiltrada);
        const recintosViaveis = this.filtrarRecintosViaveis(recintosFiltrados, especieFiltrada, quantidade);
    
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: false };
        }
    
        return { erro: null, recintosViaveis };
    }
    

    // Filtra a espécie no array de animais
    filtrarEspecie(animal) {
        return RecintosZoo.animais.find(especie => especie.especie.toLowerCase() === animal.toLowerCase());
    }

    // Valida se a quantidade fornecida é um número inteiro positivo
    validarQuantidade(quantidade) {
        return Number.isInteger(quantidade) && quantidade > 0;
    }

    // Filtra os recintos com base no bioma da espécie
    filtrarRecintosPorBioma(especie) {
        return RecintosZoo.recintos.filter(recinto => {
            if (Array.isArray(especie.bioma)) {
                return especie.bioma.some(bioma => recinto.bioma.toLowerCase().includes(bioma.toLowerCase()));
            }
            return recinto.bioma.toLowerCase().includes(especie.bioma.toLowerCase());
        });
    }

    // Filtra os recintos viáveis considerando espaço e regras específicas
    filtrarRecintosViaveis(recintos, especie, quantidade) {
        return recintos.reduce((viaveis, recinto) => {
            const tamanhoDisponivel = this.calcularEspacoDisponivel(recinto, especie, quantidade);

            if (tamanhoDisponivel >= 0 && !(especie.especie === 'MACACO' && quantidade === 1 && recinto.animaisExistentes.length === 0)) {
                viaveis.push(`Recinto ${recinto.numero} (espaço livre: ${tamanhoDisponivel} total: ${recinto.tamanhoTotal})`);
            }
            
            return viaveis;
        }, []);
    }

    // Calcula o espaço disponível no recinto após considerar o novo animal
    calcularEspacoDisponivel(recinto, especieFiltrada, quantidade) {
        let tamanhoDisponivelRecinto = recinto.tamanhoTotal;

        if (recinto.animaisExistentes.length > 0) {
            const [quantidadeExistente, especieExistenteNome] = recinto.animaisExistentes;
            const especieExistente = this.filtrarEspecie(especieExistenteNome);

            if (!this.verificarCoabitacao(especieExistente, especieFiltrada)) {
                return -1; // Coabitação inválida
            }

            tamanhoDisponivelRecinto -= quantidadeExistente * especieExistente.tamanho;
            tamanhoDisponivelRecinto -= especieFiltrada.especie !== especieExistente.especie ? 1 : 0;  // Espaço extra se forem espécies diferentes
        }

        if (especieFiltrada.especie === 'HIPOPOTAMO' && !recinto.bioma.toLowerCase().includes('savana e rio')) {
            return -1; // Hipopótamos só aceitam 'savana e rio'
        }

        tamanhoDisponivelRecinto -= especieFiltrada.tamanho * quantidade;
        return tamanhoDisponivelRecinto;
    }

    // Verifica se a coabitação entre espécies é permitida
    verificarCoabitacao(animalExistente, animalNovo) {
        // Carnívoros só podem coabitar com sua própria espécie
        if (animalExistente.carnivoro && animalNovo.carnivoro && animalExistente.especie !== animalNovo.especie) {
            return false;
        }

        // Carnívoros e herbívoros não podem coabitar
        if (animalExistente.carnivoro !== animalNovo.carnivoro) {
            return false;
        }

        return true;
    }
}

export { RecintosZoo };
