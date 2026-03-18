import useInitModel from '@/hooks/useInitModel';
import { ipSlink } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<VanBang.ICauHinh>('cau-hinh', undefined, undefined, ipSlink);

  return { ...objInit };
};
