import { module } from "@/stores/top-menu"

const modules_supervisory_supports: module[] = [
    {
        name: "Apoyo a la supervisión",
        icon: "UsersIcon",
        items: [
            {
                name: "Fortalecimiento a la supervisión monitores e instructores",
                route: "strengtheningSuperMonIns.index",
                icon: "MinusIcon",
            },
            {
                name: "Fortalecimiento a la supervisión gestores",
                route: "strengtheningSupervisionMans.index",
                icon: "MinusIcon",
            }
        ]
    },
    {
        name: "Caracterización",
        icon: "LayersIcon",
        items: [
            {
                name: "Encuesta",
                route: "polls.index",
                icon: "MinusIcon",
            }
        ]
    }
]

export default modules_supervisory_supports