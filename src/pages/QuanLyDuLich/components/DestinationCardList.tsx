import { Card, Col, InputNumber, Row, Select, Statistic, Switch, Tag } from 'antd';
import type { Destination } from '@/models/quanLyDuLich';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';

const { Option } = Select;

const typeMap: Record<string, string> = {
  biển: 'blue',
  núi: 'green',
  'thành phố': 'purple',
};

const renderTypeTag = (type: string) => <Tag color={typeMap[type] || 'default'}>{type}</Tag>;

const DestinationCardList = () => {
  const { destinations } = useModel('quanLyDuLich');

  const [filterType, setFilterType] = useState<'all' | 'biển' | 'núi' | 'thành phố'>('all');
  const [filterMinPrice, setFilterMinPrice] = useState<number>(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(10000000);
  const [filterMinRating, setFilterMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name'>('name');
  const [descSort, setDescSort] = useState(false);

  const filteredDestinations = useMemo(() => {
    const result = destinations
      .filter((d) => (filterType === 'all' ? true : d.type === filterType))
      .filter((d) => d.price >= filterMinPrice && d.price <= (filterMaxPrice || 1000000000))
      .filter((d) => d.rating >= filterMinRating)
      .sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'rating') return a.rating - b.rating;
        return a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' });
      });
    if (descSort) return [...result].reverse();
    return result;
  }, [destinations, filterType, filterMaxPrice, filterMinPrice, filterMinRating, sortBy, descSort]);

  return (
    <>
      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        <Col xs={24} sm={12} md={6}>
          <Select value={filterType} onChange={(value) => setFilterType(value)} style={{ width: '100%' }}>
            <Option value='all'>Tất cả</Option>
            <Option value='biển'>Biển</Option>
            <Option value='núi'>Núi</Option>
            <Option value='thành phố'>Thành phố</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <InputNumber
            min={0}
            value={filterMinPrice}
            style={{ width: '100%' }}
            formatter={(v) => `${v}`.replace(/\b(?=(\d{3})+(?!\d))/g, ',')}
            parser={(v: any) => v.replace(/\D/g, '')}
            onChange={(v) => setFilterMinPrice(v || 0)}
            placeholder='Giá min'
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <InputNumber
            min={0}
            value={filterMaxPrice}
            style={{ width: '100%' }}
            formatter={(v) => `${v}`.replace(/\b(?=(\d{3})+(?!\d))/g, ',')}
            parser={(v: any) => v.replace(/\D/g, '')}
            onChange={(v) => setFilterMaxPrice(v || 10000000)}
            placeholder='Giá max'
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <InputNumber
            min={0}
            max={5}
            step={0.1}
            value={filterMinRating}
            style={{ width: '100%' }}
            onChange={(v) => setFilterMinRating(v || 0)}
            placeholder='Rating tối thiểu'
          />
        </Col>
      </Row>
      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        <Col xs={16} sm={12} md={6}>
          <Select value={sortBy} onChange={(v) => setSortBy(v)} style={{ width: '100%' }}>
            <Option value='name'>Tên A-Z</Option>
            <Option value='price'>Giá</Option>
            <Option value='rating'>Rating</Option>
          </Select>
        </Col>
        <Col xs={8} sm={4} md={2}>
          <Switch checked={descSort} onChange={(v) => setDescSort(v)} checkedChildren='↓' unCheckedChildren='↑' />
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        {filteredDestinations.map((item: Destination) => (
          <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
            <Card hoverable cover={<img alt={item.name} src={item.image} style={{ height: 180, objectFit: 'cover' }} />}>
              <Card.Meta title={item.name} description={item.description} />
              <div style={{ marginTop: 8 }}>
                {renderTypeTag(item.type)}
                <Tag color='gold'>{item.rating}★</Tag>
                <Statistic title='Giá' value={item.price} valueStyle={{ fontSize: 12 }} prefix='₫' />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default DestinationCardList;
