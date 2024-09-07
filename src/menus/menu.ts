import { lightbulbO } from 'svelte-awesome/icons';
import Chapter  from '../components/bible/chapter.svelte'
import book from 'svelte-awesome/icons/book';
export let  menu = [
    {
        name: "bible",
        icon: book,
        component: Chapter
    },
    {
        name: "memory",
        icon: lightbulbO,
        component: Chapter
    }
]