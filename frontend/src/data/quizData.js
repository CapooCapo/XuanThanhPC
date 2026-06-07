export const quizSteps = [
  {
    id: 'purpose',
    title: 'Mục đích sử dụng chính?',
    subtitle: 'Chọn nhu cầu chính của bạn để hệ thống đề xuất phù hợp hơn.',
    options: [
      { id: 'gaming', label: 'Gaming', icon: '🎮' },
      { id: 'design', label: 'Thiết kế đồ họa', icon: '🎨' },
      { id: 'streaming', label: 'Youtube / Streaming', icon: '🎥' },
      { id: 'office', label: 'Văn phòng', icon: '💼' }
    ]
  },
  {
    id: 'budget',
    title: 'Ngân sách của bạn?',
    subtitle: 'Chọn khoảng ngân sách mong muốn.',
    options: [
      { id: 'under_10m', label: 'Dưới 10 triệu' },
      { id: '10_20m', label: '10 - 20 triệu' },
      { id: '20_40m', label: '20 - 40 triệu' },
      { id: 'above_40m', label: 'Trên 40 triệu' }
    ]
  },
  {
    id: 'type',
    title: 'Bạn muốn Laptop hay PC?',
    subtitle: 'Chọn thiết bị phù hợp với không gian làm việc.',
    options: [
      { id: 'pc', label: 'PC', icon: '🖥️' },
      { id: 'laptop', label: 'Laptop', icon: '💻' }
    ]
  },
  {
    id: 'style',
    title: 'Bạn thích kiểu máy như thế nào?',
    subtitle: 'Tùy chọn thêm để đề xuất chính xác hơn.',
    optional: true,
    options: [
      { id: 'slim', label: 'Nhẹ và mỏng' },
      { id: 'premium', label: 'Mạnh và đẹp' },
      { id: 'minimalist', label: 'Tối giản' },
      { id: 'rgb', label: 'RGB gaming' },
      { id: 'performance', label: 'Hiệu năng cao' },
      { id: 'quiet', label: 'Yên tĩnh' }
    ]
  }
];
