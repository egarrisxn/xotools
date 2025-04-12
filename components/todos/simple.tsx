"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Simple {
  id: string;
  text: string;
  completed: boolean;
}

export default function SimpleTodo() {
  const [todos, setTodos] = useState<Simple[]>([]);
  const [newTodoText, setNewTodoText] = useState("");

  useEffect(() => {
    const savedTodos = localStorage.getItem("focusTodos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("focusTodos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodoText.trim()) return;

    const newTodo: Simple = {
      id: Date.now().toString(),
      text: newTodoText,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setNewTodoText("");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col space-y-4 rounded-lg border p-6 shadow-xs">
      <h2 className="text-primary/80 text-center text-lg font-medium">To-do List</h2>
      <div className="flex space-x-2">
        <Input
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyUp={handleKeyUp}
          placeholder="Add todo..."
          className="bg-background/50 text-primary placeholder:text-primary/50 h-9 grow border"
        />
        <Button
          onClick={addTodo}
          className="bg-primary/10 text-primary hover:bg-primary/30 size-9 border-none p-0"
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="max-h-60 space-y-1 overflow-y-auto">
        {todos.length === 0 ? (
          <p className="text-primary/50 text-center text-sm italic">No todos</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`group flex items-center rounded p-1.5 ${todo.completed ? "bg-primary/5" : ""}`}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="data-[state=checked]:bg-primary/70 data-[state=checked]:text-primary-foreground mr-2 border"
              />
              <span
                className={`text-primary flex-1 text-sm ${todo.completed ? "text-primary/40 line-through" : ""}`}
              >
                {todo.text}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTodo(todo.id)}
                className="text-primary/50 hover:text-primary/70 size-6 opacity-0 group-hover:opacity-100 hover:bg-transparent"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
