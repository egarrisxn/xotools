"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pencil, Plus, X, Check, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import styles from "./island.module.css";

interface Island {
  id: number;
  text: string;
  completed: boolean;
}

const snappyTransition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 1,
};

export default function IslandTodo() {
  const [todos, setTodos] = useState<Island[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const remainingTodos = todos.length - completedTodos;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isExpanded && !(event.target as Element).closest(`.${styles["island-todo"]}`)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  return (
    <motion.div
      className={`${styles["island-todo"]} fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform`}
      initial={false}
      animate={{
        width: isExpanded ? "var(--island-expanded-width)" : "var(--island-collapsed-width)",
        height: isExpanded ? "auto" : "var(--island-collapsed-height)",
        borderRadius: isExpanded ? "var(--island-expanded-radius)" : "var(--island-border-radius)",
      }}
      transition={{
        ...snappyTransition,
        borderRadius: { duration: 0.08 },
      }}
    >
      <motion.div
        className="h-full cursor-pointer overflow-hidden rounded-[inherit] border border-gray-800 bg-black text-white"
        onClick={() => !isExpanded && setIsExpanded(true)}
        layout
        transition={snappyTransition}
      >
        {!isExpanded && (
          <motion.div className="flex h-full items-center justify-between p-2" layout>
            <span className="font-semibold">To-do List</span>
            <div className="flex h-full items-center space-x-2">
              {remainingTodos > 0 && (
                <span className="flex size-6 min-w-[24px] items-center justify-center rounded-full bg-yellow-500 text-xs font-medium text-black">
                  {remainingTodos}
                </span>
              )}
              {completedTodos > 0 && (
                <span className="flex size-6 min-w-[24px] items-center justify-center rounded-full bg-gray-500 text-xs font-medium text-white">
                  {completedTodos}
                </span>
              )}
            </div>
          </motion.div>
        )}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                ...snappyTransition,
                opacity: { duration: 0.1 },
              }}
              className="p-4 pb-2"
            >
              <div className="mb-4 flex items-center">
                <div className="relative mr-2 flex-grow">
                  <Input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a new todo"
                    className="h-10 w-full rounded-lg border-[#222222] bg-[#111111] pl-10 text-gray-200 transition-colors duration-200 placeholder:text-gray-500 focus:border-[#333333] focus:ring-0 focus:ring-offset-0 focus:outline-none"
                    ref={inputRef}
                    aria-label="New todo input"
                  />
                  <Pencil className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-gray-500" />
                </div>
                <Button
                  onClick={addTodo}
                  className="h-10 rounded-lg border border-[#222222] bg-[#111111] px-3 text-gray-400 transition-colors hover:bg-[#222222] hover:text-gray-200"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <motion.ul
                className={`max-h-60 space-y-2 overflow-y-auto ${styles["island-todo"]} ul`}
                role="list"
                aria-label="Todo list"
                layout
              >
                <AnimatePresence initial={false}>
                  {sortedTodos.map((todo) => (
                    <motion.li
                      key={todo.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={snappyTransition}
                      className="flex items-center justify-between"
                      role="listitem"
                      layout
                    >
                      <span
                        className={`flex-grow text-sm ${
                          todo.completed
                            ? "text-gray-500 line-through decoration-gray-500"
                            : "text-yellow-500"
                        }`}
                        onClick={() => toggleTodo(todo.id)}
                      >
                        {todo.text}
                      </span>
                      <div className="flex items-center rounded-md border border-[#222222] bg-[#111111]">
                        <Button
                          onClick={() => toggleTodo(todo.id)}
                          size="sm"
                          variant="ghost"
                          className={`${styles["island-todo"]} button h-10 rounded-none px-3 text-gray-400 hover:bg-[#222222] hover:text-gray-200`}
                          aria-label={`${todo.completed ? "Revert" : "Complete"} "${todo.text}"`}
                        >
                          {todo.completed ? <RotateCcw size={14} /> : <Check size={14} />}
                        </Button>
                        <Separator orientation="vertical" className="h-5 bg-[#222222]" />
                        <Button
                          onClick={() => removeTodo(todo.id)}
                          size="sm"
                          variant="ghost"
                          className={`${styles["island-todo"]} button h-10 rounded-none px-3 text-gray-400 hover:bg-[#222222] hover:text-gray-200`}
                          aria-label={`Remove "${todo.text}" from the list`}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
