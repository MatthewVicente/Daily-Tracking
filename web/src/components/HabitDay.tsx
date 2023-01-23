import * as Popover from '@radix-ui/react-popover';
import * as Checkbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { ProgressBar } from './ProgressBar';
import { Check } from 'phosphor-react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface HabitDayProps {
    date: Date
    completed?: number,
    amount?: number,
}

interface Habit {
    completedHabits?: string,
    date: Date,
    possibleHabits: {}[],
}

export function HabitDay({ completed = 0, amount = 0, date }: HabitDayProps) {
    const [possibleHabits, setPossibleHabits] = useState([]);
    const [habits, setHabits] = useState<Habit | null>(null);

    const completedPercentage = amount > 0 ? Math.round((completed/amount)*100) : 0;

    const dayAndMonth = dayjs(date).format('DD/MM');
    const dayOfWeek = dayjs(date).format('dddd');

    useEffect(() => {
        api.get(`/day?date=${date}`)
        .then((response) => {
                const { possibleHabits, completedHabits} = response.data;
                const habitsList = {'possibleHabits': possibleHabits, 'completedHabits': completedHabits, 'date': date};
                setHabits(habitsList);
            }) 
            .catch((error) => {
                console.log(error);
                return {};
            });
    }, []);

    return (
        <Popover.Root>
            <Popover.Trigger className={clsx('w-10 h-10 rounded-lg', {
                'bg-zinc-900 border-zinc-800': completedPercentage === 0,
                'bg-violet-900 border-violet-700': completedPercentage > 0 && completedPercentage < 20,
                'bg-violet-800 border-violet-600': completedPercentage >= 20 && completedPercentage < 40,
                'bg-violet-700 border-violet-500': completedPercentage >= 40 && completedPercentage < 60,
                'bg-violet-600 border-violet-500': completedPercentage >= 60 && completedPercentage < 80,
                'bg-violet-500 border-violet-400': completedPercentage >= 80,
            })}>

            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content 
                    side="right"
                    className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
                    <span className='font-semibold text-zinc-400'>{dayOfWeek}</span>
                    <span className='mt-1 font-extrabold leading-tight text-3xl'>{dayAndMonth}</span>

                    <ProgressBar progress={completedPercentage}/>
                        {
                            habits?.possibleHabits.map((habit) => {
                                return <div className='mt-6 flex flex-col gap-3'>
                                    <Checkbox.Root
                                        className='flex items-start gap-3 group flex-col justify-center'
                                    >
                                        <div className='flex flex-row justify-center items-center'>
                                            <div className='h-9 w-9 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500'>
                                                <Checkbox.Indicator>
                                                    <Check 
                                                        size={20} 
                                                        className="text-white"
                                                    />
                                                </Checkbox.Indicator>
                                            </div>
                                            <span key={habit.id} className='ml-2 font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                                                {habit.title}
                                            </span>
                                        </div>
                                    </Checkbox.Root>
                                </div>
                            })
                        }
                    <Popover.Arrow height={8} width={16} className="fill-zinc-900"/>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}