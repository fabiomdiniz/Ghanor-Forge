import { Race, Class, Origin, SkillName, Attribute } from '../types';

export const SKILLS: Record<SkillName, Attribute> = {
  'Acrobacia': 'DES',
  'Adestramento': 'CAR',
  'Atletismo': 'FOR',
  'Atuação': 'CAR',
  'Cavalgar': 'DES',
  'Conhecimento': 'INT',
  'Cura': 'SAB',
  'Diplomacia': 'CAR',
  'Enganação': 'CAR',
  'Fortitude': 'CON',
  'Furtividade': 'DES',
  'Guerra': 'INT',
  'Iniciativa': 'DES',
  'Intimidação': 'CAR',
  'Intuição': 'SAB',
  'Investigação': 'INT',
  'Ladinagem': 'DES',
  'Luta': 'FOR',
  'Misticismo': 'INT',
  'Nobreza': 'INT',
  'Ofício': 'INT',
  'Percepção': 'SAB',
  'Pontaria': 'DES',
  'Reflexos': 'DES',
  'Religião': 'SAB',
  'Sobrevivência': 'SAB',
  'Vontade': 'SAB'
};

export const RACES: Race[] = [
  {
    name: 'Humano',
    modifiers: {}, // Special: +1 in 3 different attributes
    abilities: ['Versátil: +2 perícias treinadas (ou 1 perícia + 1 poder geral)'],
    size: 'Médio',
    speed: 9
  },
  {
    name: 'Anão',
    modifiers: { CON: 2, INT: 1, CAR: -1 },
    abilities: ['Busca pela Perfeição', 'Devagar e Sempre', 'Moldado nas Rochas'],
    size: 'Médio',
    speed: 6
  },
  {
    name: 'Elfo',
    modifiers: { SAB: 2, DES: 1, CON: -1 },
    abilities: ['Armas da Floresta', 'Magia Antiga', 'Passo Leve', 'Sentidos Élficos', 'Sentimentos Conflitantes'],
    size: 'Médio',
    speed: 12
  },
  {
    name: 'Gigante',
    modifiers: { FOR: 3, CON: 2, INT: -2, SAB: -1, CAR: -1 },
    abilities: ['Grandão', 'Primitivo'],
    size: 'Grande',
    speed: 9
  },
  {
    name: 'Hobgoblin',
    modifiers: { FOR: 1, DES: 1, CON: 1, CAR: -1 },
    abilities: ['Couro Duro', 'Dependência de Liderança', 'Militarista', 'Natureza Bestial'],
    size: 'Médio',
    speed: 9
  },
  {
    name: 'Meio-elfo',
    modifiers: { CAR: 2 }, // Special: +1 in another
    abilities: ['Longa Infância', 'Sentidos Ancestrais'],
    size: 'Médio',
    speed: 9
  },
  {
    name: 'Aberrante',
    modifiers: { CAR: -2 },
    abilities: ['Mutações (Escolha 4)'],
    size: 'Médio',
    speed: 9
  }
];

export const CLASSES: Class[] = [
  {
    name: 'Bárbaro',
    hpBase: 24,
    hpPerLevel: 6,
    mpBase: 3,
    mpPerLevel: 3,
    trainedSkills: ['Fortitude', 'Luta'],
    extraSkillsCount: 4,
    proficiencies: ['Armas marciais', 'Escudos'],
    abilities: ['Fúria'],
    keyAttribute: 'FOR'
  },
  {
    name: 'Bardo',
    hpBase: 12,
    hpPerLevel: 3,
    mpBase: 4,
    mpPerLevel: 4,
    trainedSkills: ['Atuação', 'Reflexos'],
    extraSkillsCount: 6,
    proficiencies: ['Armas marciais'],
    abilities: ['Inspiração', 'Magias'],
    keyAttribute: 'CAR'
  },
  {
    name: 'Bucaneiro',
    hpBase: 16,
    hpPerLevel: 4,
    mpBase: 3,
    mpPerLevel: 3,
    trainedSkills: ['Reflexos'], // Choose Luta or Pontaria
    extraSkillsCount: 4,
    proficiencies: ['Armas marciais'],
    abilities: ['Audácia', 'Insolência'],
    keyAttribute: 'DES'
  },
  {
    name: 'Caçador',
    hpBase: 16,
    hpPerLevel: 4,
    mpBase: 4,
    mpPerLevel: 4,
    trainedSkills: ['Sobrevivência'], // Choose Luta or Pontaria
    extraSkillsCount: 6,
    proficiencies: ['Armas marciais', 'Escudos'],
    abilities: ['Marca da Presa', 'Rastreador'],
    keyAttribute: 'DES'
  },
  {
    name: 'Cavaleiro',
    hpBase: 20,
    hpPerLevel: 5,
    mpBase: 3,
    mpPerLevel: 3,
    trainedSkills: ['Fortitude', 'Luta'],
    extraSkillsCount: 2,
    proficiencies: ['Armas marciais', 'Armaduras pesadas', 'Escudos'],
    abilities: ['Baluarte', 'Código de Honra'],
    keyAttribute: 'FOR'
  },
  {
    name: 'Clérigo',
    hpBase: 16,
    hpPerLevel: 4,
    mpBase: 5,
    mpPerLevel: 5,
    trainedSkills: ['Religião', 'Vontade'],
    extraSkillsCount: 2,
    proficiencies: ['Armaduras pesadas', 'Escudos'],
    abilities: ['Devoto', 'Magias'],
    keyAttribute: 'SAB'
  },
  {
    name: 'Druida',
    hpBase: 16,
    hpPerLevel: 4,
    mpBase: 5,
    mpPerLevel: 5,
    trainedSkills: ['Sobrevivência', 'Vontade'],
    extraSkillsCount: 2,
    proficiencies: ['Escudos'],
    abilities: ['Devoto da Natureza', 'Empatia Selvagem', 'Magias'],
    keyAttribute: 'SAB'
  },
  {
    name: 'Ladino',
    hpBase: 12,
    hpPerLevel: 3,
    mpBase: 3,
    mpPerLevel: 3,
    trainedSkills: ['Ladinagem', 'Reflexos'],
    extraSkillsCount: 8,
    proficiencies: [],
    abilities: ['Ataque Furtivo', 'Especialista'],
    keyAttribute: 'DES'
  },
  {
    name: 'Mago',
    hpBase: 8,
    hpPerLevel: 2,
    mpBase: 5,
    mpPerLevel: 5,
    trainedSkills: ['Misticismo', 'Vontade'],
    extraSkillsCount: 2,
    proficiencies: [],
    abilities: ['Magias', 'Tradição Arcana'],
    keyAttribute: 'INT'
  },
  {
    name: 'Nobre',
    hpBase: 16,
    hpPerLevel: 4,
    mpBase: 4,
    mpPerLevel: 4,
    trainedSkills: ['Vontade'], // Choose Diplomacia or Intimidação
    extraSkillsCount: 4,
    proficiencies: ['Armas marciais', 'Armaduras pesadas', 'Escudos'],
    abilities: ['Autoconfiança', 'Espólio', 'Orgulho'],
    keyAttribute: 'CAR'
  },
  {
    name: 'Soldado',
    hpBase: 20,
    hpPerLevel: 5,
    mpBase: 3,
    mpPerLevel: 3,
    trainedSkills: ['Fortitude'], // Choose Luta or Pontaria
    extraSkillsCount: 2,
    proficiencies: ['Armas marciais', 'Escudos'],
    abilities: ['Ataque Disciplinado'],
    keyAttribute: 'FOR'
  }
];

export const ORIGINS: Origin[] = [
  { name: 'Acólito', trainedSkills: ['Religião'], benefit: '+1 PM por nível', items: ['Essência de mana', 'Símbolo sagrado'] },
  { name: 'Ajudante de Curandeiro', trainedSkills: ['Cura'], benefit: 'Curas curam +1 PV por dado', items: ['Bálsamo restaurador x2', 'Maleta de medicamentos'] },
  { name: 'Ajudante de Mercador', trainedSkills: ['Diplomacia'], benefit: 'Limite de itens vestidos +1', items: ['Burro de carga', 'Mercadorias'] },
  { name: 'Amigo dos Animais', trainedSkills: ['Adestramento'], benefit: 'Animal de estimação parceiro', items: [] },
  { name: 'Amnésico', trainedSkills: [], benefit: '2 perícias à escolha do mestre', items: [] },
  { name: 'Aprendiz de Alquimista', trainedSkills: ['Ofício'], benefit: 'Rola dado extra em itens alquímicos', items: ['Ácido x2', 'Fogo alquímico x2'] },
  { name: 'Aprendiz de Artesão', trainedSkills: ['Ofício'], benefit: 'Paga 1/5 do preço para fabricar', items: [] },
  { name: 'Aristocrata', trainedSkills: ['Nobreza'], benefit: 'Recebe nível x 300 PP ao subir de nível', items: ['Herança de família'] },
  { name: 'Artista', trainedSkills: ['Atuação', 'Enganação'], benefit: '', items: ['Estojo de disfarces', 'Instrumento musical'] },
  { name: 'Auxiliar de Cozinha', trainedSkills: ['Ofício'], benefit: 'Bônus de pratos especiais +1', items: ['Instrumentos de cozinheiro'] },
  { name: 'Camponês', trainedSkills: [], benefit: '+3 PM, +1d4 em um teste por 1 PM', items: ['Ferramenta agrícola'] },
  { name: 'Criança da Guerra', trainedSkills: ['Iniciativa'], benefit: 'Um poder de combate', items: ['Arma marcial'] },
  { name: 'Discípulo Arcano', trainedSkills: ['Misticismo'], benefit: 'CD das magias +1', items: ['Essência de mana x2'] },
  { name: 'Escravo', trainedSkills: ['Fortitude'], benefit: '+3 PV no 1º nível, +1 PV/nível', items: ['Algemas'] },
  { name: 'Escudeiro', trainedSkills: ['Percepção'], benefit: '+2 na Defesa', items: ['Cota de malha ou escudo pesado'] },
  { name: 'Estudioso', trainedSkills: ['Conhecimento'], benefit: 'Gasta 2 PM para substituir teste por Conhecimento', items: ['Bálsamo restaurador'] },
  { name: 'Grumete', trainedSkills: ['Acrobacia', 'Atletismo'], benefit: 'Sem penalidades por se equilibrar/escalar', items: ['Corda'] },
  { name: 'Herdeiro', trainedSkills: [], benefit: '+3 PV e um poder geral', items: ['Herança de família'] },
  { name: 'Isolado', trainedSkills: [], benefit: '+3 PV e um poder geral', items: ['Equipamento de viagem'] },
  { name: 'Mascote da Guarda', trainedSkills: ['Atletismo'], benefit: '+2 em ataques', items: ['Arma marcial'] },
  { name: 'Membro de Gangue', trainedSkills: ['Intimidação'], benefit: 'Ação padrão extra no 1º turno', items: ['Arma simples'] },
  { name: 'Nômade', trainedSkills: ['Atletismo', 'Sobrevivência'], benefit: 'Sem penalidade por terreno difícil natural', items: ['Bordão'] },
  { name: 'Órfão', trainedSkills: ['Atletismo'], benefit: 'Deslocamento +3m', items: ['Adaga'] },
  { name: 'Predestinado', trainedSkills: [], benefit: '+1 em um atributo', items: [] },
  { name: 'Rato', trainedSkills: ['Furtividade', 'Ladinagem'], benefit: '', items: ['Ferramentas de ladrão'] },
  { name: 'Receptáculo', trainedSkills: [], benefit: 'Lança uma magia de 1º círculo', items: ['Essência de mana'] },
  { name: 'Refugiado', trainedSkills: ['Vontade'], benefit: 'Condição de descanso aumenta em uma categoria', items: [] },
  { name: 'Selvagem', trainedSkills: ['Sobrevivência'], benefit: '+2 em dano corpo a corpo', items: ['Arma simples'] },
  { name: 'Serviçal', trainedSkills: ['Diplomacia', 'Intuição'], benefit: '', items: ['Carta de recomendação'] },
  { name: 'Trapaceiro', trainedSkills: ['Enganação'], benefit: 'Substitui Diplomacia por Enganação', items: ['Estojo de disfarces'] }
];
