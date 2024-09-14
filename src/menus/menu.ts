import { heart, home, search, bars, book } from 'svelte-awesome/icons';
import Chapter from '../components/bible/chapter.svelte'
import Memory from '../components/memory/memory.svelte';
export let menu = [
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
        icon: heart,
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