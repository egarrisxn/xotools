"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Dynamic {
  id: number;
  text: string;
  completed: boolean;
}

const defaultTodos: Dynamic[] = [
  {
    id: 1,
    text: "Conduct user interviews for new dashboard design",
    completed: false,
  },
  {
    id: 2,
    text: "Create wireframes for mobile navigation",
    completed: false,
  },
  {
    id: 3,
    text: "Review accessibility guidelines for forms",
    completed: false,
  },
  {
    id: 4,
    text: "Complete usability testing report",
    completed: true,
  },
  {
    id: 5,
    text: "Update user persona documentation",
    completed: true,
  },
];

export default function DynamicTodo() {
  const [todos, setTodos] = useState<Dynamic[]>(defaultTodos);
  const [newTodo, setNewTodo] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([{ id: Date.now(), text: newTodo, completed: false }, ...todos]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos
        .map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
        .sort((a, b) => Number(a.completed) - Number(b.completed)),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <Card className="w-full max-w-md border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header with Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Tasks</h1>
              <Toggle
                aria-label="Toggle completed tasks visibility"
                pressed={showCompleted}
                onPressedChange={setShowCompleted}
                className="bg-gray-600 hover:bg-gray-600/80 data-[state=on]:bg-gray-500"
              >
                {showCompleted ? (
                  <Eye className="size-4 text-gray-50" />
                ) : (
                  <EyeOff className="size-4 text-gray-50" />
                )}
              </Toggle>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-2 bg-gray-200/20 [&>div]:bg-green-700" />
            </div>
            <p className="text-sm">
              {completedCount} of {todos.length} tasks completed
            </p>
          </div>

          {/* Add Todo Form */}
          <form onSubmit={addTodo} className="flex gap-2">
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 focus:border-sky-400 focus:ring-sky-400"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-sky-500 text-gray-50 hover:bg-sky-500/80"
            >
              <Plus className="size-4" />
            </Button>
          </form>

          {/* Todo List */}
          <motion.div layout className="space-y-2">
            <AnimatePresence initial={false}>
              {activeTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    opacity: { duration: 0.2 },
                  }}
                >
                  <div className="group flex items-center gap-3 rounded-md bg-gray-700/30 p-3 transition-all duration-300 hover:bg-gray-700/50">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="border-gray-500 transition-colors"
                    />
                    <span className="flex-1 text-gray-50">{todo.text}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Divider */}
          {showCompleted && completedTodos.length > 0 && activeTodos.length > 0 && (
            <div className="border-t border-gray-500" />
          )}

          {/* Completed Todo List */}
          {showCompleted && (
            <motion.div layout className="space-y-2">
              <AnimatePresence initial={false}>
                {completedTodos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      opacity: { duration: 0.2 },
                    }}
                  >
                    <div className="group flex items-center gap-3 rounded-md bg-gray-700/50 p-3 text-gray-300/80 transition-all duration-300">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="border-gray-400 transition-colors data-[state=checked]:bg-gray-400 data-[state=checked]:text-gray-900"
                      />
                      <span className="flex-1">{todo.text}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteTodo(todo.id)}
                        className="text-gray-400 hover:bg-transparent hover:text-gray-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {todos.length === 0 && (
            <div className="pt-6 pb-2 text-center text-gray-400">No tasks.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
