import useServiceModel, { Service } from '@/models/nhanvienvadichvu/service';
import ServiceForm from './ServiceForm';
import ServiceTable from './ServiceTable';

export default function ServiceTab() {
    const { services, addService, deleteService } = useServiceModel();

    const handleAddService = (values: Omit<Service, 'id'>) => {
        addService({ ...values, id: Date.now().toString() });
    };

    return (
        <>
            <ServiceForm onSubmit={handleAddService} />
            <ServiceTable services={services} onDelete={deleteService} />
        </>
    );
}
