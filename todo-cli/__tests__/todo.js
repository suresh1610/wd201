const todoList = require('../todo');

const {all, markAsComplete, add, dueToday, overdue ,dueLater}= todoList();

var declare_date = new Date();
const structure_Date = (declare_date) => {
    return declare_date.toISOString().split("T")[0];
};

var newDate = new Date();
// today
const present_day = structure_Date(newDate);

// yesterDay
const yesterDay = structure_Date(
    new Date(new Date().setDate(newDate.getDate() - 1))
);

//tomorrow
const nextday = structure_Date(
    new Date(new Date().setDate(newDate.getDate() + 1))
);

//test suites
describe("Todolist Test Case", () => {
    beforeAll(() => {

        add(
            {
                title:"first todo in before block",
                completed: false,
                dueDate: present_day
            },
        ),
        add(
            {
                
                title:"Second todo for ",
                completed: false,
                dueDate: yesterDay,
            
            }
        ),
        add(
            {
                title:"Third todo for overdue ",
                completed: false,
                dueDate:nextday,

            }
        )
    })
    test("Add new todo", () => {  
        const todoCount = all.length;
        add(
            {
                title: "Add new case  test",
                completed: true,
                dueDate:present_day//new Date().toISOString().split("T")[0]
            }
        );
        expect(all.length).toBe(todoCount + 1);
    });


    test("mark a todo as completed or not", () => {
        expect(all[0].completed).toBe(false);
        markAsComplete(0);
        expect(all[0].completed).toBe(true);
    })

//test case for today
    test("Due2day Testing", () => {
        expect(dueToday().length).toBe(2);
    })

//test case for overdue (yesterday)
    test("overDue testing", () => {
        expect(overdue().length).toBe(1);
    })
    
//test case for duelater (tomorrow)
    test("Duelater Testing", () => {
        expect(dueLater().length).toBe(1);
    }) 
});