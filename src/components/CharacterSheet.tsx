import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sword, BookOpen, Heart, Zap, Scroll, Package, Edit3, Save, X, Plus, Minus } from 'lucide-react';
import { Character, SkillName, Attribute, AttributeSet } from '../types';
import { SKILLS } from '../data/rules';
import { calculateSkillBonus } from '../utils/characterUtils';

interface Props {
  character: Character;
  onUpdate: (char: Character) => void;
}

export default function CharacterSheet({ character, onUpdate }: Props) {
  const [isEditingAttrs, setIsEditingAttrs] = useState(false);
  const [tempAttrs, setTempAttrs] = useState<AttributeSet>(character.attributes);
  
  const defense = 10 + character.attributes.DES;

  const handleAttrChange = (attr: Attribute, delta: number) => {
    setTempAttrs(prev => ({ ...prev, [attr]: prev[attr] + delta }));
  };

  const saveAttrs = () => {
    // Recalculate maxHP if CON changed
    const conDiff = tempAttrs.CON - character.attributes.CON;
    const newMaxHP = character.maxHP + conDiff;
    const newCurrentHP = character.currentHP + conDiff;

    onUpdate({ 
      ...character, 
      attributes: tempAttrs,
      maxHP: newMaxHP,
      currentHP: Math.max(0, newCurrentHP)
    });
    setIsEditingAttrs(false);
  };

  const cancelAttrs = () => {
    setTempAttrs(character.attributes);
    setIsEditingAttrs(false);
  };

  const updateHP = (delta: number) => {
    onUpdate({ ...character, currentHP: Math.min(character.maxHP, Math.max(0, character.currentHP + delta)) });
  };

  const updateMP = (delta: number) => {
    onUpdate({ ...character, currentMP: Math.min(character.maxMP, Math.max(0, character.currentMP + delta)) });
  };

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState(character.notes);

  const saveNotes = () => {
    onUpdate({ ...character, notes: tempNotes });
    setIsEditingNotes(false);
  };

  return (
    <div className="parchment-card w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Header Info */}
      <div className="lg:col-span-3 border-b-2 border-ghanor-gold pb-4 mb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-5xl font-bold text-ghanor-red uppercase tracking-tighter">{character.name}</h2>
          <p className="text-xl italic opacity-80">{character.concept}</p>
        </div>
        <div className="flex gap-4 text-sm font-bold uppercase">
          <div className="text-center bg-ghanor-brown/5 p-2 rounded border border-ghanor-gold/30">
            <div className="opacity-60">Raça</div>
            <div>{character.race}</div>
          </div>
          <div className="text-center bg-ghanor-brown/5 p-2 rounded border border-ghanor-gold/30">
            <div className="opacity-60">Classe</div>
            <div>{character.class}</div>
          </div>
          <div className="text-center bg-ghanor-brown/5 p-2 rounded border border-ghanor-gold/30">
            <div className="opacity-60">Nível</div>
            <div>{character.level}</div>
          </div>
        </div>
      </div>

      {/* Attributes & Main Stats */}
      <div className="space-y-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold uppercase tracking-tight border-b-2 border-ghanor-gold pr-4">Atributos</h3>
          {!isEditingAttrs ? (
            <button 
              onClick={() => setIsEditingAttrs(true)}
              className="ghanor-button py-1 px-3 text-xs flex items-center gap-2"
            >
              <Edit3 className="w-3 h-3" /> Editar Atributos
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={saveAttrs}
                className="bg-green-700 text-white px-3 py-1 rounded text-xs font-bold uppercase flex items-center gap-1 hover:bg-green-800 transition-colors"
              >
                <Save className="w-3 h-3" /> Salvar
              </button>
              <button 
                onClick={cancelAttrs}
                className="bg-red-700 text-white px-3 py-1 rounded text-xs font-bold uppercase flex items-center gap-1 hover:bg-red-800 transition-colors"
              >
                <X className="w-3 h-3" /> Cancelar
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {(['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'] as Attribute[]).map((attr) => (
            <div key={attr} className="relative group">
              <div className="bg-parchment-dark border-2 border-ghanor-gold p-3 rounded text-center shadow-md group-hover:shadow-lg transition-shadow">
                <div className="text-xs font-bold text-ghanor-red uppercase">{attr}</div>
                <div className="flex items-center justify-center gap-2">
                  {isEditingAttrs && (
                    <button onClick={() => handleAttrChange(attr, -1)} className="text-ghanor-red hover:bg-red-100 rounded-full p-1">
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                  <div className="text-3xl font-bold">
                    {(isEditingAttrs ? tempAttrs[attr] : character.attributes[attr]) > 0 ? `+${isEditingAttrs ? tempAttrs[attr] : character.attributes[attr]}` : (isEditingAttrs ? tempAttrs[attr] : character.attributes[attr])}
                  </div>
                  {isEditingAttrs && (
                    <button onClick={() => handleAttrChange(attr, 1)} className="text-ghanor-red hover:bg-red-100 rounded-full p-1">
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg border-l-8 border-red-600 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-600" />
                <div className="text-xs font-bold uppercase text-red-800">Pontos de Vida</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateHP(-1)} className="bg-red-200 hover:bg-red-300 p-1 rounded"><Minus className="w-4 h-4" /></button>
                <button onClick={() => updateHP(-5)} className="bg-red-200 hover:bg-red-300 px-2 py-1 rounded text-[10px] font-bold">-5</button>
                <button onClick={() => updateHP(5)} className="bg-red-200 hover:bg-red-300 px-2 py-1 rounded text-[10px] font-bold">+5</button>
                <button onClick={() => updateHP(1)} className="bg-red-200 hover:bg-red-300 p-1 rounded"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <input 
                type="number"
                className="text-3xl font-bold text-red-900 bg-transparent border-none w-20 focus:outline-none focus:ring-1 focus:ring-red-300 rounded"
                value={character.currentHP}
                onChange={(e) => onUpdate({ ...character, currentHP: Math.min(character.maxHP, Math.max(0, parseInt(e.target.value) || 0)) })}
              />
              <div className="text-sm opacity-60">/ {character.maxHP}</div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border-l-8 border-blue-600 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-600" />
                <div className="text-xs font-bold uppercase text-blue-800">Pontos de Mana</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateMP(-1)} className="bg-blue-200 hover:bg-blue-300 p-1 rounded"><Minus className="w-4 h-4" /></button>
                <button onClick={() => updateMP(1)} className="bg-blue-200 hover:bg-blue-300 p-1 rounded"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <input 
                type="number"
                className="text-3xl font-bold text-blue-900 bg-transparent border-none w-20 focus:outline-none focus:ring-1 focus:ring-blue-300 rounded"
                value={character.currentMP}
                onChange={(e) => onUpdate({ ...character, currentMP: Math.min(character.maxMP, Math.max(0, parseInt(e.target.value) || 0)) })}
              />
              <div className="text-sm opacity-60">/ {character.maxMP}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border-l-8 border-gray-600 shadow-sm">
            <Shield className="w-8 h-8 text-gray-600" />
            <div>
              <div className="text-xs font-bold uppercase text-gray-800">Defesa</div>
              <div className="text-3xl font-bold text-gray-900">{defense}</div>
            </div>
          </div>

          <button 
            onClick={() => onUpdate({ ...character, currentHP: character.maxHP, currentMP: character.maxMP })}
            className="ghanor-button w-full bg-ghanor-gold text-ghanor-brown flex items-center justify-center gap-2"
          >
            <Scroll className="w-4 h-4" /> Descanso Longo
          </button>
        </div>
      </div>

      {/* Skills */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center gap-2 border-b border-ghanor-gold pb-1 mb-4">
          <Scroll className="w-5 h-5 text-ghanor-red" />
          <h3 className="text-xl font-bold uppercase tracking-tight">Perícias</h3>
        </div>
        <div className="grid grid-cols-1 gap-1 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {(Object.keys(SKILLS) as SkillName[]).sort().map(skill => {
            const bonus = calculateSkillBonus(character, skill);
            const isTrained = character.trainedSkills.includes(skill);
            return (
              <div 
                key={skill} 
                className={`flex justify-between items-center p-2 rounded text-sm ${isTrained ? 'bg-ghanor-gold/20 font-bold' : 'opacity-70'}`}
              >
                <div className="flex items-center gap-2">
                  {isTrained && <div className="w-1.5 h-1.5 rounded-full bg-ghanor-red" />}
                  <span>{skill}</span>
                  <span className="text-[10px] opacity-50 uppercase">({SKILLS[skill]})</span>
                </div>
                <div className="text-lg">{bonus > 0 ? `+${bonus}` : bonus}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipment & Abilities */}
      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-2 border-b border-ghanor-gold pb-1 mb-4">
            <Package className="w-5 h-5 text-ghanor-red" />
            <h3 className="text-xl font-bold uppercase tracking-tight">Equipamento</h3>
          </div>
          <ul className="space-y-2">
            {character.equipment.length > 0 ? (
              character.equipment.map((item, i) => (
                <li key={i} className="text-sm p-2 bg-white/40 rounded border border-ghanor-gold/10 italic">
                  {item}
                </li>
              ))
            ) : (
              <li className="text-sm opacity-50 italic">Nenhum item carregado.</li>
            )}
          </ul>
        </section>

        <section>
          <div className="flex items-center justify-between border-b border-ghanor-gold pb-1 mb-4">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-ghanor-red" />
              <h3 className="text-xl font-bold uppercase tracking-tight">Notas & Habilidades</h3>
            </div>
            {!isEditingNotes ? (
              <button 
                onClick={() => { setTempNotes(character.notes); setIsEditingNotes(true); }}
                className="text-ghanor-red hover:text-red-700 text-xs font-bold uppercase"
              >
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={saveNotes} className="text-green-700 hover:text-green-800"><Save className="w-4 h-4" /></button>
                <button onClick={() => setIsEditingNotes(false)} className="text-red-700 hover:text-red-800"><X className="w-4 h-4" /></button>
              </div>
            )}
          </div>
          <div className="text-sm space-y-4">
            {isEditingNotes ? (
              <textarea
                className="ghanor-input min-h-[200px] text-sm w-full"
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                autoFocus
              />
            ) : (
              <div className="p-4 bg-white/40 rounded border border-ghanor-gold/10 min-h-[100px] whitespace-pre-wrap">
                {character.notes || 'Nenhuma nota registrada.'}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
