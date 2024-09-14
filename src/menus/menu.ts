import { lightbulbO, home, search, bars } from 'svelte-awesome/icons';
import Chapter  from '../components/bible/chapter.svelte'
import book from 'svelte-awesome/icons/book';
import Memory from '../components/memory/memory.svelte';
export let  menu = [
    {
        name: "home",
        icon: home,
        component: Chapter
    },
    {
        name: "bible",
        icon: book,
        component: Chapter
    },
    {
        name: "memory",
        icon: lightbulbO,
        component: Memory
    },
    {
        name: "search",
        icon: search,
        component: Memory
    },
    {
        name: "more",
        icon: bars,
        component: Memory
    },


]