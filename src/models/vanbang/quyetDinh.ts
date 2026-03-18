import useInitModel from '@/hooks/useInitModel';
import { ipSlink } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<VanBang.IQuyetDinh>('quyet-dinh', undefined, undefined, ipSlink);

  return { ...objInit };
};
