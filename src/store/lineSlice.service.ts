export function findObj(state: any[], value: number): any {
    let fo = state.find((li) => li.id === value);
    if (!fo) {
      for (let i = 0; i < state.length; i++) {
        if (state[i].child) {
          const fo2 = findObj(state[i].child, value);
          if (fo2) return fo2;
        }
      }
    } else return fo;
  }
  
export  function updateData(data: any[], level = 0) {
    data.map((item) => (item.level = level));
    let arrayOfChilds: any[] = [];
    data.forEach((item: any) => {
      if (item.child) {
        arrayOfChilds = [...arrayOfChilds, ...item.child];
      }
    });
    data.map((item) => {
      if (item.child) {
        updateData(arrayOfChilds, (level += 1));
        arrayOfChilds = [];
      }
    });
  }