import { useParams } from 'react-router-dom';

export default function RoutineDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="routine-detail-page">
      <h1>Chi tiết giáo án</h1>
      <p>Mã giáo án: {id}</p>
    </div>
  );
}
