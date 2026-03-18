import useInitModel from '@/hooks/useInitModel';
import { ipSlink } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<VanBang.ISoVanBang>('so-van-bang', undefined, undefined, ipSlink);

  return { ...objInit };
};
