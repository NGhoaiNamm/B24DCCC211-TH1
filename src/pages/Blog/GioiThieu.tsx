import React from 'react';
import { Card, Typography, Avatar, Tag, Row, Col, Divider, Space } from 'antd';
import {
  GithubOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  MailOutlined,
  CodeOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const AUTHOR = {
  name: 'Nguyễn Văn An',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
  bio: `Xin chào! Tôi là một lập trình viên Full-Stack với hơn 3 năm kinh nghiệm. Tôi đam mê xây dựng các ứng dụng web hiện đại, tối ưu trải nghiệm người dùng và khám phá các công nghệ mới. Blog này là nơi tôi chia sẻ kiến thức và kinh nghiệm trong quá trình học tập và làm việc.`,
  skills: [
    { category: 'Frontend', items: ['React', 'TypeScript', 'HTML5', 'CSS3', 'Ant Design'] },
    { category: 'Backend', items: ['Node.js', 'Express', 'NestJS', 'RESTful API'] },
    { category: 'Database', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'] },
    { category: 'DevOps & Tools', items: ['Git', 'Docker', 'Nginx', 'Linux'] },
  ],
  social: [
    { icon: <GithubOutlined />, label: 'GitHub', url: 'https://github.com', color: '#24292e' },
    { icon: <FacebookOutlined />, label: 'Facebook', url: 'https://facebook.com', color: '#1877f2' },
    { icon: <LinkedinOutlined />, label: 'LinkedIn', url: 'https://linkedin.com', color: '#0a66c2' },
    { icon: <MailOutlined />, label: 'Email', url: 'mailto:contact@example.com', color: '#ea4335' },
  ],
  stats: [
    { label: 'Bài viết', value: '12+' },
    { label: 'Dự án', value: '20+' },
    { label: 'Năm kinh nghiệm', value: '3+' },
    { label: 'Công nghệ', value: '15+' },
  ],
};

const GioiThieu: React.FC = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Profile Header Card */}
      <Card
        bordered={false}
        style={{
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          marginBottom: '24px',
          overflow: 'hidden',
        }}
      >
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <Avatar
              src={AUTHOR.avatar}
              size={160}
              style={{ border: '4px solid rgba(255,255,255,0.5)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
            />
          </Col>
          <Col xs={24} md={16}>
            <Title level={1} style={{ color: 'white', margin: 0, fontSize: '36px' }}>
              {AUTHOR.name}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', display: 'block', marginBottom: '16px' }}>
              Full-Stack Developer 🚀
            </Text>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
              {AUTHOR.bio}
            </Paragraph>
            <div style={{ marginTop: '24px' }}>
              <Space size="middle" wrap>
                {AUTHOR.social.map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {item.icon} {item.label}
                  </a>
                ))}
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {AUTHOR.stats.map((stat) => (
          <Col xs={12} md={6} key={stat.label}>
                        <div style={{ textAlign: 'center', borderRadius: '12px', padding: '12px' }}>
                <Title level={2} style={{ margin: 0, color: '#667eea' }}>{stat.value}</Title>
                <Text type="secondary">{stat.label}</Text>
              </div>
          </Col>
        ))}
      </Row>

      {/* Skills Section */}
      <Card
        title={
          <Space>
            <CodeOutlined style={{ color: '#667eea' }} />
            <span>Kỹ năng & Công nghệ</span>
          </Space>
        }
        bordered={false}
        style={{ borderRadius: '12px' }}
      >
        <Row gutter={[24, 24]}>
          {AUTHOR.skills.map((skillGroup) => (
            <Col xs={24} sm={12} key={skillGroup.category}>
              <div>
                <Text
                  strong
                  style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontSize: '15px',
                    color: '#444',
                    borderLeft: '3px solid #667eea',
                    paddingLeft: '8px',
                  }}
                >
                  {skillGroup.category}
                </Text>
                <Space size={[8, 8]} wrap>
                  {skillGroup.items.map((skill) => (
                    <Tag
                      key={skill}
                      color="geekblue"
                      style={{ fontSize: '13px', padding: '4px 10px', borderRadius: '12px' }}
                    >
                      {skill}
                    </Tag>
                  ))}
                </Space>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default GioiThieu;
