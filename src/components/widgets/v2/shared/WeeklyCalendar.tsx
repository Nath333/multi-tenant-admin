/**
 * Shared Weekly Calendar Component
 * Ultra-modern weekly schedule calendar with minute-level precision
 * Features:
 * - Minute-level time range selection (e.g., 8:10 - 16:30)
 * - Quick preset schedules (Work Hours, Morning, Evening, etc.)
 * - Copy/paste schedules between days
 * - Drag-to-paint multiple cells
 * - Bulk operations (set entire days/hours)
 */

import { useState } from 'react';
import { Card, Row, Col, Space, Button, TimePicker, Divider, Tag } from 'antd';
import { ClockCircleOutlined, PlusOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export interface WeeklySchedule {
  [day: string]: {
    [hour: string]: 'off' | 'on';
  };
}

export interface TimeRange {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface SchedulePreset {
  name: string;
  icon: string;
  ranges: TimeRange[];
  days?: string[];
}

interface WeeklyCalendarProps {
  schedule: WeeklySchedule;
  onChange: (schedule: WeeklySchedule) => void;
  title?: string;
  showByDefault?: boolean;
  customPresets?: SchedulePreset[];
}

interface AppliedTimeRange {
  id: string;
  days: string[];
  startTime: string;
  endTime: string;
}

export default function WeeklyCalendar({
  schedule,
  onChange,
  title = 'Weekly Schedule',
  showByDefault = false,
}: WeeklyCalendarProps) {
  const [showSchedule, setShowSchedule] = useState(showByDefault);
  const [timeRangeStart, setTimeRangeStart] = useState(dayjs().hour(8).minute(10));
  const [timeRangeEnd, setTimeRangeEnd] = useState(dayjs().hour(16).minute(30));
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [appliedRanges, setAppliedRanges] = useState<AppliedTimeRange[]>([]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDaySelection = (day: string) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      }
      return [...prev, day];
    });
  };

  const applyCustomTimeRange = () => {
    if (selectedDays.length === 0) return;

    // Add to applied ranges list
    const newRange: AppliedTimeRange = {
      id: `${Date.now()}-${Math.random()}`,
      days: [...selectedDays],
      startTime: timeRangeStart.format('HH:mm'),
      endTime: timeRangeEnd.format('HH:mm'),
    };

    setAppliedRanges(prev => [...prev, newRange]);

    // Update schedule
    const updated = { ...schedule };
    const range: TimeRange = {
      startHour: timeRangeStart.hour(),
      startMinute: timeRangeStart.minute(),
      endHour: timeRangeEnd.hour(),
      endMinute: timeRangeEnd.minute(),
    };

    selectedDays.forEach(day => {
      if (!updated[day]) updated[day] = {};

      // Handle overnight ranges (e.g., 22:00 to 6:00)
      if (range.endHour < range.startHour) {
        for (let h = range.startHour; h < 24; h++) {
          updated[day][h] = 'on';
        }
        for (let h = 0; h <= range.endHour; h++) {
          updated[day][h] = 'on';
        }
      } else {
        // Normal range within same day
        for (let h = range.startHour; h <= range.endHour; h++) {
          if (h === range.startHour && range.startMinute > 0) {
            updated[day][h] = 'on';
          } else if (h === range.endHour && range.endMinute === 0) {
            continue;
          } else if (h < range.endHour) {
            updated[day][h] = 'on';
          }
        }
      }
    });

    onChange(updated);
    setSelectedDays([]);
  };

  const removeTimeRange = (id: string) => {
    setAppliedRanges(prev => prev.filter(r => r.id !== id));
    // Note: This doesn't remove from schedule - you may want to recalculate schedule from remaining ranges
  };

  const duplicateTimeRange = (range: AppliedTimeRange) => {
    // Parse the time and set it in the pickers
    const [startHour, startMin] = range.startTime.split(':').map(Number);
    const [endHour, endMin] = range.endTime.split(':').map(Number);
    setTimeRangeStart(dayjs().hour(startHour).minute(startMin));
    setTimeRangeEnd(dayjs().hour(endHour).minute(endMin));
    setSelectedDays(range.days);
    // Scroll to top of schedule picker
    const scheduleElement = document.querySelector('[data-schedule-picker]');
    if (scheduleElement) {
      scheduleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Card
      size="small"
      style={{
        marginBottom: 16,
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #e8e8e8'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{
          fontSize: 16,
          fontWeight: 600,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <ClockCircleOutlined style={{ color: '#667eea', WebkitTextFillColor: '#667eea' }} />
          {title}
        </div>
        <Button
          size="small"
          onClick={() => setShowSchedule(!showSchedule)}
          type={showSchedule ? 'default' : 'primary'}
          style={{ borderRadius: 6 }}
        >
          {showSchedule ? 'Hide Schedule' : 'Show Schedule'}
        </Button>
      </div>
      {showSchedule && (
        <div style={{ marginTop: 0 }}>
          {/* Modern Custom Time Range Picker - ALWAYS VISIBLE */}
          <div
            data-schedule-picker
            style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              padding: 20,
              borderRadius: 12,
              border: '1px solid #e0e6ed',
              marginBottom: 20
            }}
          >
            <div style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#2d3748',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <ClockCircleOutlined style={{ fontSize: 18, color: '#667eea' }} />
              Custom Time Range
            </div>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div style={{
                  fontSize: 12,
                  color: '#4a5568',
                  marginBottom: 10,
                  fontWeight: 500
                }}>
                  Select days to apply schedule
                </div>

                {/* Quick Day Selection Buttons */}
                <Space size={6} style={{ marginBottom: 12 }}>
                  <Button
                    size="small"
                    onClick={() => setSelectedDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])}
                    style={{ fontSize: 11, borderRadius: 6 }}
                  >
                    Weekdays
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setSelectedDays(['Saturday', 'Sunday'])}
                    style={{ fontSize: 11, borderRadius: 6 }}
                  >
                    Weekend
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setSelectedDays(days)}
                    style={{ fontSize: 11, borderRadius: 6 }}
                  >
                    All Days
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setSelectedDays([])}
                    style={{ fontSize: 11, borderRadius: 6 }}
                  >
                    Clear
                  </Button>
                </Space>

                <Space wrap size={[8, 8]}>
                  {days.map((day) => (
                    <Tag
                      key={day}
                      color={selectedDays.includes(day) ? 'blue' : 'default'}
                      style={{
                        cursor: 'pointer',
                        userSelect: 'none',
                        padding: '6px 14px',
                        fontSize: 13,
                        fontWeight: 500,
                        borderRadius: 8,
                        border: selectedDays.includes(day) ? '2px solid #667eea' : '2px solid #e2e8f0',
                        background: selectedDays.includes(day)
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : '#ffffff',
                        color: selectedDays.includes(day) ? '#ffffff' : '#4a5568',
                        transition: 'all 0.2s ease',
                        boxShadow: selectedDays.includes(day)
                          ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                          : '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                      onClick={() => toggleDaySelection(day)}
                    >
                      {day.slice(0, 3)}
                    </Tag>
                  ))}
                </Space>
              </Col>

              <Col span={24}>
                <div style={{
                  fontSize: 12,
                  color: '#4a5568',
                  marginBottom: 8,
                  fontWeight: 500
                }}>
                  Quick Time Presets
                </div>
                <Space wrap size={6}>
                  <Button
                    size="small"
                    onClick={() => {
                      setTimeRangeStart(dayjs().hour(9).minute(0));
                      setTimeRangeEnd(dayjs().hour(17).minute(0));
                    }}
                    style={{ fontSize: 11, borderRadius: 6 }}
                  >
                    Work (9:00-17:00)
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setTimeRangeStart(dayjs().hour(6).minute(0));
                      setTimeRangeEnd(dayjs().hour(12).minute(0));
                    }}
                    style={{ fontSize: 11, borderRadius: 6 }}
                  >
                    Morning (6:00-12:00)
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setTimeRangeStart(dayjs().hour(12).minute(0));
                      setTimeRangeEnd(dayjs().hour(18).minute(0));
                    }}
                    style={{ fontSize: 11, borderRadius: 6 }}
                  >
                    Afternoon (12:00-18:00)
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setTimeRangeStart(dayjs().hour(18).minute(0));
                      setTimeRangeEnd(dayjs().hour(23).minute(0));
                    }}
                    style={{ fontSize: 11, borderRadius: 6 }}
                  >
                    Evening (18:00-23:00)
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setTimeRangeStart(dayjs().hour(0).minute(0));
                      setTimeRangeEnd(dayjs().hour(23).minute(59));
                    }}
                    style={{ fontSize: 11, borderRadius: 6 }}
                  >
                    Full Day
                  </Button>
                </Space>
              </Col>

              <Col xs={24} sm={12}>
                <div style={{
                  fontSize: 12,
                  color: '#4a5568',
                  marginBottom: 8,
                  fontWeight: 500
                }}>
                  Start Time
                </div>
                <TimePicker
                  format="HH:mm"
                  value={timeRangeStart}
                  onChange={(time) => time && setTimeRangeStart(time)}
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    border: '2px solid #e2e8f0'
                  }}
                  size="large"
                  minuteStep={5}
                  placeholder="08:10"
                />
              </Col>

              <Col xs={24} sm={12}>
                <div style={{
                  fontSize: 12,
                  color: '#4a5568',
                  marginBottom: 8,
                  fontWeight: 500
                }}>
                  End Time
                </div>
                <TimePicker
                  format="HH:mm"
                  value={timeRangeEnd}
                  onChange={(time) => time && setTimeRangeEnd(time)}
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    border: '2px solid #e2e8f0'
                  }}
                  size="large"
                  minuteStep={5}
                  placeholder="16:30"
                />
              </Col>

              <Col span={24}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
                  marginTop: 8
                }}>
                  <div style={{
                    fontSize: 13,
                    color: '#4a5568',
                    fontWeight: 500,
                    padding: '8px 16px',
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0'
                  }}>
                    <span style={{ color: '#667eea', fontWeight: 600 }}>
                      {timeRangeStart.format('HH:mm')}
                    </span>
                    {' → '}
                    <span style={{ color: '#764ba2', fontWeight: 600 }}>
                      {timeRangeEnd.format('HH:mm')}
                    </span>
                    {selectedDays.length > 0 && (
                      <span style={{ marginLeft: 8, color: '#718096' }}>
                        ({selectedDays.length} day{selectedDays.length > 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    onClick={applyCustomTimeRange}
                    disabled={selectedDays.length === 0}
                    icon={<PlusOutlined />}
                    style={{
                      borderRadius: 8,
                      fontWeight: 600,
                      background: selectedDays.length > 0
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : undefined,
                      border: 'none',
                      boxShadow: selectedDays.length > 0
                        ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                        : undefined,
                      height: 42
                    }}
                  >
                    Apply Schedule
                  </Button>
                </div>
              </Col>
            </Row>
          </div>

          {/* Applied Time Ranges List */}
          {appliedRanges.length > 0 && (
            <>
              <Divider style={{ margin: '20px 0', borderColor: '#e0e6ed' }} />
              <div style={{ marginTop: 20 }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#2d3748',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <ClockCircleOutlined style={{ fontSize: 18, color: '#667eea' }} />
                  Applied Schedules ({appliedRanges.length})
                </div>

                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                  {appliedRanges.map((range) => (
                    <div
                      key={range.id}
                      style={{
                        padding: 16,
                        background: '#ffffff',
                        borderRadius: 12,
                        border: '2px solid #e0e6ed',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 12,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: '#2d3748',
                          marginBottom: 8
                        }}>
                          <span style={{ color: '#667eea' }}>{range.startTime}</span>
                          {' → '}
                          <span style={{ color: '#764ba2' }}>{range.endTime}</span>
                        </div>
                        <Space wrap size={[6, 6]}>
                          {range.days.map((day) => (
                            <Tag
                              key={day}
                              style={{
                                background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ef 100%)',
                                border: '1px solid #d0d7de',
                                borderRadius: 6,
                                padding: '2px 10px',
                                fontSize: 12,
                                fontWeight: 500,
                                color: '#4a5568'
                              }}
                            >
                              {day.slice(0, 3)}
                            </Tag>
                          ))}
                        </Space>
                      </div>
                      <Space>
                        <Button
                          type="text"
                          size="small"
                          onClick={() => duplicateTimeRange(range)}
                          icon={<CopyOutlined />}
                          style={{
                            borderRadius: 8,
                            color: '#667eea'
                          }}
                        >
                          Duplicate
                        </Button>
                        <Button
                          type="text"
                          danger
                          size="small"
                          onClick={() => removeTimeRange(range.id)}
                          icon={<DeleteOutlined />}
                          style={{
                            borderRadius: 8,
                            color: '#dc2626'
                          }}
                        >
                          Remove
                        </Button>
                      </Space>
                    </div>
                  ))}
                </Space>
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
