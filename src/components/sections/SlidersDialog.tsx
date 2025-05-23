import { Button } from "../atoms/button";
import { DialogClose, DialogContent, DialogFooter } from "../atoms/dialog";

type SlidersDialogProps = Readonly<{
  children: React.ReactNode;
}>;


export function SlidersDialog({children}:SlidersDialogProps){
  return (
    <DialogContent scrollable className='sm:min-w-[610px]' aria-describedby=''>
      {children}
    <DialogFooter>
      <DialogClose asChild>
        <Button type='button'>Close</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
  )
}