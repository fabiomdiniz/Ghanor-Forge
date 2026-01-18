/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Scroll, UserPlus, Shield, Sword, BookOpen } from 'lucide-react';
import { Character } from './types';
import CharacterWizard from './components/CharacterWizard';
import CharacterSheet from './components/CharacterSheet';

export default function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ghanor_characters');
    if (saved) {
      setCharacters(JSON.parse(saved));
    }
  }, []);

  const saveCharacter = (char: Character) => {
    const updated = [...characters.filter(c => c.id !== char.id), char];
    setCharacters(updated);
    localStorage.setItem('ghanor_characters', JSON.stringify(updated));
    setIsCreating(false);
    setSelectedCharacter(char);
  };

  const deleteCharacter = (id: string) => {
    const updated = characters.filter(c => c.id !== id);
    setCharacters(updated);
    localStorage.setItem('ghanor_characters', JSON.stringify(updated));
    if (selectedCharacter?.id === id) setSelectedCharacter(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <header className="mb-12 text-center">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-center gap-4 mb-2"
        >
          <Scroll className="text-ghanor-gold w-12 h-12" />
          <h1 className="text-5xl font-bold text-ghanor-gold tracking-widest uppercase">
            Ghanor Forge
          </h1>
        </motion.div>
        <p className="text-parchment opacity-80 italic">O Jogo de Interpretação Oficial do Nerdcast RPG</p>
      </header>

      <main className="w-full max-w-6xl">
        <AnimatePresence mode="wait">
          {isCreating ? (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <CharacterWizard onSave={saveCharacter} onCancel={() => setIsCreating(false)} />
            </motion.div>
          ) : selectedCharacter ? (
            <motion.div
              key="sheet"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="mb-4 flex justify-between items-center">
                <button 
                  onClick={() => setSelectedCharacter(null)}
                  className="ghanor-button flex items-center gap-2"
                >
                  <Scroll className="w-4 h-4" /> Voltar à Lista
                </button>
                <div className="flex gap-2">
                   <button 
                    onClick={() => setIsCreating(true)}
                    className="ghanor-button flex items-center gap-2 bg-ghanor-gold text-ghanor-brown"
                  >
                    <UserPlus className="w-4 h-4" /> Novo Herói
                  </button>
                </div>
              </div>
              <CharacterSheet character={selectedCharacter} onUpdate={saveCharacter} />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreating(true)}
                className="parchment-card border-dashed flex flex-col items-center justify-center gap-4 min-h-[200px] text-ghanor-red hover:border-ghanor-red transition-colors"
              >
                <UserPlus className="w-12 h-12" />
                <span className="text-xl font-bold uppercase">Criar Novo Herói</span>
              </motion.button>

              {characters.map((char) => (
                <motion.div
                  key={char.id}
                  whileHover={{ scale: 1.02 }}
                  className="parchment-card group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-ghanor-red">{char.name}</h3>
                      <p className="text-sm italic opacity-70">{char.concept}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }}
                      className="text-ghanor-brown hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div className="flex items-center gap-1"><Shield className="w-4 h-4" /> {char.race}</div>
                    <div className="flex items-center gap-1"><Sword className="w-4 h-4" /> {char.class}</div>
                    <div className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> Nível {char.level}</div>
                  </div>

                  <button 
                    onClick={() => setSelectedCharacter(char)}
                    className="ghanor-button w-full"
                  >
                    Ver Ficha
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
