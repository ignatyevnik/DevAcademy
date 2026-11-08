import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Plus, Trash2, Download, Save, ArrowLeft, RotateCcw, Clock, Eye, Edit, Copy, Upload, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { Course, Module, Lesson, Step } from '@/data';
import { baseSlugs, courses } from '@/data';
import { courseSchema } from '@/data/schemas';
import { BlockEditor } from '@/components/editor/BlockEditor';
import { QuizEditor } from '@/components/editor/QuizEditor';
import { TextBlocks, QuizView } from '@/components/StepContent';

export default function EditorPage() {
  const [course, setCourse] = useState<Course>({
    slug: 'my-custom-course',
    title: 'Мой новый курс',
    subtitle: 'Описание',
    description: 'Подробное описание',
    level: 'Новичок',
    tags: ['Custom'],
    accent: '#4a90d9',
    icon: 'python',
    outcomes: ['Чему-то научиться'],
    requirements: ['Желание учиться'],
    modules: [],
  });
  
  const [previewMode, setPreviewMode] = useState(false);
  const isBase = baseSlugs.has(course.slug);

  const updateCourse = (field: keyof Course, value: any) => {
    setCourse(prev => ({ ...prev, [field]: value }));
  };

  const loadCourse = (slug: string) => {
    if (!slug) {
      setCourse({
        slug: 'my-custom-course', 
        title: 'Мой новый курс', 
        subtitle: 'Описание', 
        description: 'Подробное описание',
        level: 'Новичок', 
        tags: ['Custom'], 
        accent: '#4a90d9', 
        icon: 'python',
        outcomes: ['Чему-то научиться'], 
        requirements: ['Желание учиться'], 
        modules: [],
      });
      return;
    }
    const found = courses.find(c => c.slug === slug);
    if (found) {
      setCourse(JSON.parse(JSON.stringify(found)));
    }
  };

  const addModule = () => {
    const newModule: Module = {
      id: `mod-${Date.now()}`,
      title: 'Новый модуль',
      lessons: [],
    };
    setCourse(prev => ({ ...prev, modules: [...prev.modules, newModule] }));
  };

  const addLesson = (moduleIndex: number) => {
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: 'Новый урок',
      minutes: 10,
      steps: [],
    };
    const newModules = [...course.modules];
    newModules[moduleIndex].lessons.push(newLesson);
    setCourse(prev => ({ ...prev, modules: newModules }));
  };

  const addStep = (moduleIndex: number, lessonIndex: number, type: 'theory' | 'quiz') => {
    let newStep: Step;
    if (type === 'theory') {
      newStep = {
        id: `step-${Date.now()}`,
        title: 'Новый шаг',
        type: 'theory',
        blocks: [{ type: 'p', text: 'Текст теории' }],
      };
    } else {
      newStep = {
        id: `step-${Date.now()}`,
        title: 'Проверь себя',
        type: 'quiz',
        quiz: {
          kind: 'single',
          question: 'Вопрос?',
          options: [{ id: 'a', text: 'Да' }, { id: 'b', text: 'Нет' }],
          correct: ['a'],
          explanation: 'Объяснение',
        },
      };
    }
    const newModules = [...course.modules];
    newModules[moduleIndex].lessons[lessonIndex].steps.push(newStep);
    setCourse(prev => ({ ...prev, modules: newModules }));
  };

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const skipAutoSave = useRef(true);

  const saveToLocal = (silent = false) => {
    try {
      const cleanedModules = course.modules
        .map((m) => ({ ...m, lessons: m.lessons.filter((l) => l.steps.length > 0) }))
        .filter((m) => m.lessons.length > 0);

      if (cleanedModules.length === 0) return;

      const cleanedCourse = { ...course, modules: cleanedModules };
      const result = courseSchema.safeParse(cleanedCourse);
      
      if (!result.success) return;

      const prev = localStorage.getItem('dev-academy-custom-courses');
      if (prev && prev !== '[]') localStorage.setItem('dev-academy-custom-courses-backup', prev);

      const existing: Course[] = JSON.parse(prev || '[]');
      const updated = [...existing.filter((c) => c.slug !== cleanedCourse.slug), cleanedCourse];
      localStorage.setItem('dev-academy-custom-courses', JSON.stringify(updated));

      if (!silent) {
        toast.success('Курс сохранён.');
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch {
      if (!silent) toast.error('Ошибка сохранения');
    }
  };

  useEffect(() => {
    if (skipAutoSave.current) {
      skipAutoSave.current = false;
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      saveToLocal(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [course]);

  const restoreOriginal = () => {
    if (!confirm(`Удалить локальную версию курса «${course.title}» и вернуть оригинал?`)) return;
    const existing: Course[] = JSON.parse(localStorage.getItem('dev-academy-custom-courses') || '[]');
    const updated = existing.filter((c) => c.slug !== course.slug);
    localStorage.setItem('dev-academy-custom-courses', JSON.stringify(updated));
    toast.success('Локальная версия удалена. Обновите страницу.');
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(course, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

    const generateId = (prefix: string) => 
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const duplicateLesson = (mIdx: number, lIdx: number) => {
    const newModules = [...course.modules];
    const original = newModules[mIdx].lessons[lIdx];
    const clone = JSON.parse(JSON.stringify(original));
    
    clone.id = generateId('les');
    clone.title = `${original.title} (копия)`;
    clone.steps = clone.steps.map((s: any) => ({ ...s, id: generateId('step') }));

    newModules[mIdx].lessons.splice(lIdx + 1, 0, clone);
    setCourse({ ...course, modules: newModules });
  };

  const duplicateStep = (mIdx: number, lIdx: number, sIdx: number) => {
    const newModules = [...course.modules];
    const original = newModules[mIdx].lessons[lIdx].steps[sIdx];
    const clone = JSON.parse(JSON.stringify(original));
    
    clone.id = generateId('step');
    clone.title = `${original.title} (копия)`;

    newModules[mIdx].lessons[lIdx].steps.splice(sIdx + 1, 0, clone);
    setCourse({ ...course, modules: newModules });
  };

  const importRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const template = {
      slug: 'my-new-course',
      title: 'Мой новый курс',
      subtitle: 'Краткое описание',
      description: 'Подробное описание курса',
      level: 'Новичок',
      tags: ['Custom'],
      accent: '#4a90d9',
      icon: 'python',
      outcomes: ['Чему-то научиться'],
      requirements: ['Желание учиться'],
      modules: [
        {
          id: 'mod-1',
          title: 'Модуль 1',
          lessons: [
            {
              id: 'les-1',
              title: 'Урок 1',
              minutes: 10,
              steps: [
                {
                  id: 'step-1',
                  title: 'Введение',
                  type: 'theory',
                  blocks: [{ type: 'p', text: 'Текст теории' }],
                },
              ],
            },
          ],
        },
      ],
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'course-template.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Шаблон скачан');
  };

  const onImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const raw = await file.text();
      const json = JSON.parse(raw);
      const result = courseSchema.safeParse(json);
      if (!result.success) {
        const issue = result.error.issues[0];
        const path = issue.path.length ? issue.path.join('.') : '(корень)';
        toast.error(`Невалидный курс: ${path} — ${issue.message}`);
        return;
      }
      const imported = result.data as Course;
      setCourse(imported);
      toast.success(`Курс «${imported.title}» загружен. Проверьте и сохраните.`);
      // Автосейв сработает через 5 сек (useEffect на [course]) — попадёт в localStorage-черновик
    } catch (err) {
      toast.error(`Ошибка импорта: ${err instanceof Error ? err.message : 'неизвестная'}`);
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center gap-2 px-4">
          <Link to="/" className="grid h-10 w-10 place-items-center rounded-md hover:bg-accent shrink-0"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-lg font-bold hidden sm:block">Редактор</h1>
          
          <select
            value={courses.some(c => c.slug === course.slug) ? course.slug : ''}
            onChange={(e) => loadCourse(e.target.value)}
            className="h-9 flex-1 max-w-[250px] rounded border border-input bg-background px-3 text-sm ml-2 hidden sm:block"
          >
            <option value="">+ Создать новый курс</option>
            <optgroup label="Редактировать существующий">
              {courses.map(c => (
                <option key={c.slug} value={c.slug}>{c.title}</option>
              ))}
            </optgroup>
          </select>

          <div className="ml-auto flex items-center gap-2">
            <Button 
              onClick={() => setPreviewMode(!previewMode)} 
              variant={previewMode ? "secondary" : "outline"} 
              className="gap-2"
            >
              {previewMode ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="hidden sm:inline">{previewMode ? 'В редактор' : 'Предпросмотр'}</span>
            </Button>

            {isBase && !previewMode && (
              <Button onClick={restoreOriginal} variant="outline" className="gap-2 hidden md:flex">
                <RotateCcw className="h-4 w-4" /> Вернуть оригинал
              </Button>
            )}
            {!previewMode && (
            <>
              <Button
                onClick={downloadTemplate}
                variant="outline"
                className="gap-2 hidden lg:flex"
                title="Скачать шаблон JSON"
              >
                <FileJson className="h-4 w-4" />
                <span className="hidden xl:inline">Шаблон</span>
              </Button>
              <Button
                onClick={() => importRef.current?.click()}
                variant="outline"
                className="gap-2"
                title="Импорт курса из JSON"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Импорт</span>
              </Button>
              <input
                ref={importRef}
                type="file"
                accept="application/json,.json"
                onChange={onImportFile}
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
              />
            <Button onClick={() => saveToLocal()} variant="outline" className="gap-2 hidden sm:flex"><Save className="h-4 w-4" /> Сохранить</Button>
            <div className="w-24 text-xs text-right">
            {saveStatus === 'saving' && <span className="text-muted-foreground animate-pulse">Сохранение...</span>}
            {saveStatus === 'saved' && <span className="text-green-500 font-medium">Сохранено</span>}
          </div>
                <Button onClick={downloadJson} className="gap-2"><Download className="h-4 w-4" /></Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-4 pb-24 space-y-6">
        {!previewMode && isBase && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
            <p className="font-medium">Встроенный курс</p>
            <p className="mt-1 text-muted-foreground">
              При сохранении будет создана локальная копия, которая заменит оригинал <strong>только в этом браузере</strong>. Исходник в коде приложения не изменится.
            </p>
          </div>
        )}

        {!previewMode && (
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="font-bold text-lg">Основная информация</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1"><span className="text-sm font-medium">Название</span><Input value={course.title} onChange={e => updateCourse('title', e.target.value)} /></label>
              <label className="space-y-1">
                <span className="text-sm font-medium">Slug (URL)</span>
                <Input value={course.slug} onChange={e => updateCourse('slug', e.target.value)} disabled={isBase} />
              </label>
            </div>
            <label className="space-y-1 block"><span className="text-sm font-medium">Описание</span><Input value={course.subtitle} onChange={e => updateCourse('subtitle', e.target.value)} /></label>
          </div>
        )}

        {course.modules.map((mod, mIdx) => (
          <div key={mod.id} className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              {previewMode ? (
                <h2 className="font-bold text-lg py-2">{mod.title}</h2>
              ) : (
                <>
                  <Input value={mod.title} onChange={e => { const n = [...course.modules]; n[mIdx].title = e.target.value; setCourse({ ...course, modules: n }); }} className="font-bold max-w-sm" />
                  <Button variant="destructive" size="sm" onClick={() => { if (confirm(`Удалить модуль «${mod.title}»?`)) setCourse({ ...course, modules: course.modules.filter((_, i) => i !== mIdx) }); }}><Trash2 className="h-4 w-4" /></Button>
                </>
              )}
            </div>
            
            {mod.lessons.map((les, lIdx) => (
              <div key={les.id} className="ml-0 sm:ml-6 sm:border-l-2 border-border sm:pl-4 space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  {previewMode ? (
                    <h3 className="font-medium text-base py-2 border-b border-border w-full">{les.title}</h3>
                  ) : (
                    <>
                      <Input value={les.title} onChange={(e) => { const n = [...course.modules]; n[mIdx].lessons[lIdx].title = e.target.value; setCourse({ ...course, modules: n }); }} className="font-medium max-w-xs" />
                      <div className="relative flex items-center" title="Примерное время прохождения урока в минутах">
                        <Clock className="absolute left-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input type="number" min={1} value={les.minutes} onChange={(e) => { const n = [...course.modules]; n[mIdx].lessons[lIdx].minutes = Number(e.target.value); setCourse({ ...course, modules: n }); }} className="w-32 pl-8 pr-12 text-sm" aria-label="Время прохождения в минутах" />
                        <span className="absolute right-2.5 text-xs font-medium text-muted-foreground pointer-events-none">мин</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => duplicateLesson(mIdx, lIdx)} title="Дублировать урок">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm(`Удалить урок «${les.title}»?`)) { const n = [...course.modules]; n[mIdx].lessons.splice(lIdx, 1); setCourse({ ...course, modules: n }); } }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>

                {les.steps.map((step, sIdx) => (
                  <div key={step.id} className={`rounded-lg border p-3 space-y-3 ${previewMode ? 'border-transparent bg-background' : 'border-border bg-background'}`}>
                    {previewMode ? (
                      <div className="p-2 sm:p-6 bg-card rounded-xl">
                        <h4 className="text-xl font-bold mb-4">{step.title}</h4>
                        {step.type === 'theory' ? (
                          <TextBlocks blocks={step.blocks} />
                        ) : (
                          <QuizView slug={course.slug} step={step} onResult={() => {}} />
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${step.type === 'theory' ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-600'}`}>
                            {step.type === 'theory' ? 'Теория' : 'Тест'}
                          </span>
                          <Input value={step.title} onChange={(e) => { const n = [...course.modules]; n[mIdx].lessons[lIdx].steps[sIdx].title = e.target.value; setCourse({ ...course, modules: n }); }} className="flex-1 h-8 text-sm font-medium" />
                          <Button variant="ghost" size="sm" onClick={() => duplicateStep(mIdx, lIdx, sIdx)} title="Дублировать шаг">
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { if (confirm(`Удалить шаг «${step.title}»?`)) { const n = [...course.modules]; n[mIdx].lessons[lIdx].steps.splice(sIdx, 1); setCourse({ ...course, modules: n }); } }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {step.type === 'theory' && (
                          <div className="space-y-2">
                            {step.blocks.map((b, bIdx) => (
                              <BlockEditor
                                key={bIdx}
                                block={b}
                                onChange={(newB) => { const n = [...course.modules]; (n[mIdx].lessons[lIdx].steps[sIdx] as any).blocks[bIdx] = newB; setCourse({ ...course, modules: n }); }}
                                onDelete={() => { if (confirm('Удалить этот блок?')) { const n = [...course.modules]; (n[mIdx].lessons[lIdx].steps[sIdx] as any).blocks.splice(bIdx, 1); setCourse({ ...course, modules: n }); } }}
                              />
                            ))}
                            <div className="flex flex-wrap gap-1">
{(['p', 'h3', 'list', 'code', 'note', 'table', 'image', 'mermaid', 'sandbox', 'python'] as const).map((t) => (
  <Button key={t} variant="outline" size="sm" onClick={() => {
    const newBlock: any = { type: t };
    if (t === 'p' || t === 'h3' || t === 'note') newBlock.text = '';
    else if (t === 'list') newBlock.items = [''];
    else if (t === 'code') { newBlock.lang = 'text'; newBlock.code = ''; }
    else if (t === 'table') { newBlock.head = ['A', 'B']; newBlock.rows = [['', '']]; }
    else if (t === 'image') {
      newBlock.src = 'https://placehold.co/600x400?text=Image';
      newBlock.alt = 'Описание изображения';
    }
    else if (t === 'mermaid') { newBlock.code = 'graph TD\n  A --> B'; }
    else if (t === 'sandbox') {
      newBlock.sandbox = {
        schema: 'CREATE TABLE users (id INTEGER, email TEXT);\nINSERT INTO users VALUES (1, \'a@x.com\');',
        task: 'Выберите все email.',
        solution: 'SELECT email FROM users;',
      };
    }
    else if (t === "python") {
        newBlock.python = {
          starterCode: "# ваш код\n",
          task: "Напечатайте Hello, World!",
          solution: "print('Hello, World!')",
          expected: { type: "stdout", value: "Hello, World!" },
        };
      }
    const n = [...course.modules];
    (n[mIdx].lessons[lIdx].steps[sIdx] as any).blocks.push(newBlock);
    setCourse({ ...course, modules: n });
  }}>+ {t}</Button>
))}
                            </div>
                          </div>
                        )}

                        {step.type === 'quiz' && (
                          <QuizEditor
                            quiz={step.quiz}
                            onChange={(newQ) => { const n = [...course.modules]; (n[mIdx].lessons[lIdx].steps[sIdx] as any).quiz = newQ; setCourse({ ...course, modules: n }); }}
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}

                {!previewMode && (
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => addStep(mIdx, lIdx, 'theory')}>+ Теория</Button>
                    <Button variant="outline" size="sm" onClick={() => addStep(mIdx, lIdx, 'quiz')}>+ Тест</Button>
                  </div>
                )}
              </div>
            ))}
            {!previewMode && <Button variant="secondary" size="sm" onClick={() => addLesson(mIdx)}>+ Добавить урок</Button>}
          </div>
        ))}
        {!previewMode && <Button onClick={addModule} className="w-full gap-2" variant="outline"><Plus className="h-4 w-4" /> Добавить модуль</Button>}
      </main>
    </div>
  );
}